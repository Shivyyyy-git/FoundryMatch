import crypto from "node:crypto";
import jwt, {
  type JwtPayload,
  type Secret,
  type SignOptions,
} from "jsonwebtoken";
import type { User } from "../../shared/schema.js";
import { authService, type SessionMetadata } from "../services/authService.js";
import type { UserProfileContext } from "../storage.js";

const ACCESS_TOKEN_SECRET_ENV =
  process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET_ENV =
  process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET;
const ACCESS_TOKEN_TTL = (process.env.JWT_ACCESS_TTL ?? "15m") as SignOptions["expiresIn"];
const REFRESH_TOKEN_TTL = (process.env.JWT_REFRESH_TTL ?? "7d") as SignOptions["expiresIn"];

if (!ACCESS_TOKEN_SECRET_ENV || !REFRESH_TOKEN_SECRET_ENV) {
  throw new Error(
    "JWT secrets are not configured. Set JWT_ACCESS_SECRET or JWT_SECRET and JWT_REFRESH_SECRET.",
  );
}

const ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET_ENV as Secret;
const REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET_ENV as Secret;

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  userType: User["userType"];
  isAdmin: boolean;
  emailVerified: boolean;
}

function buildAccessTokenPayload(user: User): AccessTokenPayload {
  return {
    sub: user.id,
    userType: user.userType,
    isAdmin: user.isAdmin,
    emailVerified: user.emailVerified ?? false,
  };
}

export function signAccessToken(user: User): string {
  const payload = buildAccessTokenPayload(user);
  const options: SignOptions = { expiresIn: ACCESS_TOKEN_TTL };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
}

function signRefreshToken(user: User, jti: string): {
  token: string;
  expiresAt: Date;
} {
  const options: SignOptions = { expiresIn: REFRESH_TOKEN_TTL };
  const token = jwt.sign({ sub: user.id, jti }, REFRESH_TOKEN_SECRET, options);
  const decoded = jwt.decode(token) as JwtPayload;
  const expiresAt = decoded?.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  return { token, expiresAt };
}

export async function issueSessionTokens(
  user: User,
  metadata: SessionMetadata,
): Promise<{
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}> {
  const accessToken = signAccessToken(user);
  const decodedAccess = jwt.decode(accessToken) as JwtPayload;
  const accessExpiresAt = decodedAccess?.exp
    ? new Date(decodedAccess.exp * 1000)
    : new Date(Date.now() + 1000 * 60 * 15);
  const jti = crypto.randomUUID();
  const { token: refreshToken, expiresAt } = signRefreshToken(user, jti);
  await authService.createRefreshToken(user.id, refreshToken, expiresAt, metadata, jti);
  return {
    accessToken,
    accessTokenExpiresAt: accessExpiresAt,
    refreshToken,
    refreshTokenExpiresAt: expiresAt,
  };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
}

export async function refreshSessionTokens(
  token: string,
  metadata: SessionMetadata,
): Promise<{
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  user: User;
  context: UserProfileContext;
}> {
  const payload = verifyRefreshToken(token);
  if (!payload.sub) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const existing = await authService.findValidRefreshToken(token);
  if (!existing) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  await authService.revokeRefreshTokenById(existing.refreshToken.id);

  const tokens = await issueSessionTokens(existing.user, metadata);
  const context = await authService.getUserContext(existing.user.id);
  if (!context) {
    throw new Error("USER_NOT_FOUND");
  }

  return {
    ...tokens,
    user: existing.user,
    context,
  };
}

export function decodeAccessToken(token: string): AccessTokenPayload | null {
  const decoded = jwt.decode(token);
  if (!decoded) {
    return null;
  }
  const payload = decoded as JwtPayload;
  if (!payload.sub) {
    return null;
  }
  return payload as AccessTokenPayload;
}

