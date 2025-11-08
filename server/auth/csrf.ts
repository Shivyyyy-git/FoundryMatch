import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

const isProduction = process.env.NODE_ENV === "production";

export function generateCsrfToken(): string {
  return crypto.randomBytes(20).toString("hex");
}

export function setCsrfCookie(res: Response, token: string) {
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });
}

export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const csrfCookie = req.cookies?.[CSRF_COOKIE_NAME];
  const csrfHeader =
    (req.headers[CSRF_HEADER_NAME] as string | undefined) ??
    (req.headers[CSRF_HEADER_NAME.toUpperCase()] as string | undefined);

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ message: "CSRF token mismatch" });
  }

  next();
}

