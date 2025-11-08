import type { NextFunction, Request, Response } from "express";
import type { User } from "../../shared/schema.js";
import { authService } from "../services/authService.js";
import type { UserProfileContext } from "../storage.js";
import {
  decodeAccessToken,
  issueSessionTokens,
  refreshSessionTokens,
  verifyAccessToken,
} from "./jwt.js";
import { clearAuthCookies, setAuthCookies } from "./cookies.js";

declare module "express-serve-static-core" {
  interface Request {
    authUser?: User;
    authContext?: UserProfileContext;
  }
}

type Tokens = {
  accessToken?: string;
  refreshToken?: string;
};

function extractTokens(req: Request): Tokens {
  const cookies = req.cookies ?? {};
  const accessToken =
    cookies.access_token ||
    extractBearerToken(req.headers.authorization ?? req.headers.Authorization);
  const refreshToken = cookies.refresh_token;
  return { accessToken, refreshToken };
}

function extractBearerToken(
  header: string | string[] | undefined,
): string | undefined {
  if (!header) return undefined;
  const value = Array.isArray(header) ? header[0] : header;
  if (!value) return undefined;
  const parts = value.split(" ");
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    return parts[1];
  }
  return undefined;
}

function buildSessionMetadata(req: Request) {
  return {
    userAgent: req.get("user-agent") ?? undefined,
    ipAddress: req.ip,
  };
}

async function hydrateRequest(
  req: Request,
  res: Response,
  userId: string,
  tokens?: {
    accessToken: string;
    accessTokenExpiresAt: Date;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
  },
  providedContext?: UserProfileContext,
) {
  const context =
    providedContext ?? (await authService.getUserContext(userId));
  if (!context) {
    clearAuthCookies(res);
    throw new Error("USER_NOT_FOUND");
  }
  req.authUser = context.user;
  req.authContext = context;
  if (tokens) {
    setAuthCookies(res, tokens);
  }
}

export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { accessToken } = extractTokens(req);
  if (!accessToken) {
    return next();
  }

  try {
    const payload = verifyAccessToken(accessToken);
    await hydrateRequest(req, res, payload.sub);
    next();
  } catch {
    // Ignore invalid tokens for optional auth
    next();
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { accessToken, refreshToken } = extractTokens(req);

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      await hydrateRequest(req, res, payload.sub);
      return next();
    }
  } catch (error) {
    // Check if it's a JWT error (expired or invalid token)
    const isJwtError =
      error &&
      typeof error === "object" &&
      ("name" in error &&
        (error.name === "TokenExpiredError" ||
          error.name === "JsonWebTokenError"));
    if (!isJwtError) {
      return next(error);
    }
    // For expired or invalid tokens we'll try refresh below
  }

  if (!refreshToken) {
    clearAuthCookies(res);
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const metadata = buildSessionMetadata(req);
    const result = await refreshSessionTokens(refreshToken, metadata);

    await hydrateRequest(
      req,
      res,
      result.user.id,
      {
        accessToken: result.accessToken,
        accessTokenExpiresAt: result.accessTokenExpiresAt,
        refreshToken: result.refreshToken,
        refreshTokenExpiresAt: result.refreshTokenExpiresAt,
      },
      result.context,
    );

    next();
  } catch (error) {
    clearAuthCookies(res);
    return res.status(401).json({ message: "Authentication required" });
  }
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  await requireAuth(req, res, async (err?: unknown) => {
    if (err) {
      return next(err as Error);
    }
    if (!req.authUser?.isAdmin) {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
  });
}

