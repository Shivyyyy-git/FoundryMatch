import bcrypt from "bcrypt";
import { type Request, Router } from "express";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { z } from "zod";
import { authService } from "../services/authService.js";
import { csrfProtection, generateCsrfToken, setCsrfCookie } from "../auth/csrf.js";
import { clearAuthCookies, setAuthCookies } from "../auth/cookies.js";
import { issueSessionTokens } from "../auth/jwt.js";
import { serializeUserContext } from "../utils/userResponse.js";
import { sendEmail } from "../utils/email.js";
import { optionalAuth } from "../auth/middleware.js";
import type { UserProfileContext } from "../storage.js";

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

const baseUrl =
  process.env.APP_BASE_URL ??
  process.env.CLIENT_ORIGIN?.split(",")[0]?.trim() ??
  "http://localhost:5173";

const googleSuccessRedirect =
  process.env.GOOGLE_SUCCESS_REDIRECT ?? `${baseUrl}/auth/callback`;
const googleFailureRedirect =
  process.env.GOOGLE_FAILURE_REDIRECT ?? `${baseUrl}/login?error=oauth_failed`;

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  name: z.string().min(1, "Name is required"),
  userType: z.enum(["student", "professor", "company", "entrepreneur"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const verifyEmailSchema = z.object({
  token: z.string().min(10),
});

const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

const passwordResetConfirmSchema = z.object({
  token: z.string().min(10),
  password: registerSchema.shape.password,
});

function buildSessionMetadata(req: Request) {
  return {
    userAgent: req.get("user-agent") ?? undefined,
    ipAddress: req.ip,
  };
}

function createVerificationEmail(email: string, token: string) {
  const url = new URL(`${baseUrl}/verify-email`);
  url.searchParams.set("token", token);
  return {
    subject: "Verify your Match Me Up Foundry account",
    html: `
      <p>Thanks for signing up for Match Me Up Foundry!</p>
      <p>Please confirm your email address by clicking the button below.</p>
      <p><a href="${url.toString()}" style="display:inline-block;padding:10px 16px;background-color:#273c75;color:#ffffff;text-decoration:none;border-radius:6px;">Verify Email</a></p>
      <p>If the button does not work, copy and paste this URL into your browser:</p>
      <p><a href="${url.toString()}">${url.toString()}</a></p>
    `,
    text: `Verify your email by visiting: ${url.toString()}`,
  };
}

function createPasswordResetEmail(email: string, token: string) {
  const url = new URL(`${baseUrl}/password-reset`);
  url.searchParams.set("token", token);
  return {
    subject: "Reset your Match Me Up Foundry password",
    html: `
      <p>We received a request to reset the password for your Match Me Up Foundry account.</p>
      <p>If you made this request, click the button below to set a new password.</p>
      <p><a href="${url.toString()}" style="display:inline-block;padding:10px 16px;background-color:#273c75;color:#ffffff;text-decoration:none;border-radius:6px;">Reset Password</a></p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <p>This link will expire in one hour.</p>
    `,
    text: `Reset your password by visiting: ${url.toString()}\nThis link expires in one hour.`,
  };
}

router.get("/csrf", (req, res) => {
  const token = generateCsrfToken();
  setCsrfCookie(res, token);
  res.json({ csrfToken: token });
});

router.post(
  "/register",
  authLimiter,
  csrfProtection,
  async (req, res, next) => {
    try {
      const payload = registerSchema.parse(req.body);
      const passwordHash = await bcrypt.hash(payload.password, 12);

      const { context, verificationToken } = await authService.createLocalUser({
        email: payload.email,
        passwordHash,
        name: payload.name,
        userType: payload.userType,
      });

      const emailContent = createVerificationEmail(
        context.user.email,
        verificationToken,
      );
      // Send email, but don't fail registration if email fails
      sendEmail({
        to: context.user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      }).catch((err) => {
        console.error("Failed to send verification email:", err);
        // Log the verification token so user can still verify
        console.log(`Verification token for ${context.user.email}: ${verificationToken}`);
      });

      res.status(201).json({
        message: "Account created. Please check your email to verify your account.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid registration data", errors: error.flatten() });
      }
      if (error instanceof Error && error.message === "EMAIL_ALREADY_REGISTERED") {
        return res.status(409).json({ message: "Email is already registered" });
      }
      next(error);
    }
  },
);

router.post("/login", authLimiter, csrfProtection, async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await authService.findUserByEmail(payload.email);

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before signing in.",
      });
    }

    await authService.recordLogin(user.id);

    const tokens = await issueSessionTokens(user, buildSessionMetadata(req));
    const context = await authService.getUserContext(user.id);
    if (!context) {
      return res.status(500).json({ message: "Unable to load user profile" });
    }

    setAuthCookies(res, tokens);
    res.json(serializeUserContext(context));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid login data", errors: error.flatten() });
    }
    next(error);
  }
});

router.post("/logout", csrfProtection, optionalAuth, async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;
  if (refreshToken) {
    await authService.revokeRefreshToken(refreshToken);
  }
  clearAuthCookies(res);
  res.json({ success: true });
});

router.get("/verify-email", async (req, res) => {
  const token = z.string().min(10).safeParse(req.query.token);
  if (!token.success) {
    return res.status(400).json({ message: "Invalid verification token" });
  }

  const context = await authService.verifyEmailToken(token.data);
  if (!context) {
    return res.status(400).json({ message: "Verification token is invalid or expired" });
  }

  const tokens = await issueSessionTokens(context.user, {
    userAgent: undefined,
    ipAddress: undefined,
  });

  setAuthCookies(res, tokens);
  res.json(serializeUserContext(context));
});

router.post(
  "/password-reset/request",
  authLimiter,
  csrfProtection,
  async (req, res) => {
    const parsed = passwordResetRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid request", errors: parsed.error.flatten() });
    }

    const user = await authService.findUserByEmail(parsed.data.email);
    if (user && user.passwordHash) {
      const { token } = await authService.createPasswordResetToken(user.id);
      const emailContent = createPasswordResetEmail(user.email, token);
      await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });
    }

    res.json({ message: "If an account exists for that email, you'll receive a reset link shortly." });
  },
);

router.post(
  "/password-reset/confirm",
  authLimiter,
  csrfProtection,
  async (req, res) => {
    const parsed = passwordResetConfirmSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid request", errors: parsed.error.flatten() });
    }

    const user = await authService.verifyPasswordResetToken(parsed.data.token);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset token is invalid or has expired" });
    }

    const newHash = await bcrypt.hash(parsed.data.password, 12);
    await authService.updatePassword(user.id, newHash);

    res.json({ message: "Password has been reset. You can now sign in." });
  },
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: googleFailureRedirect,
  }),
  async (req, res, next) => {
    try {
      const context = req.user as UserProfileContext | undefined;
      if (!context) {
        clearAuthCookies(res);
        return res.redirect(googleFailureRedirect);
      }

      const tokens = await issueSessionTokens(
        context.user,
        buildSessionMetadata(req),
      );
      setAuthCookies(res, tokens);
      res.redirect(googleSuccessRedirect);
    } catch (error) {
      next(error);
    }
  },
);

export default router;

