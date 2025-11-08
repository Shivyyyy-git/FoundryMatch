import type { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

type CookieOptions = {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
};

export function setAuthCookies(res: Response, options: CookieOptions) {
  const accessMaxAge = Math.max(
    0,
    options.accessTokenExpiresAt.getTime() - Date.now(),
  );
  const refreshMaxAge = Math.max(
    0,
    options.refreshTokenExpiresAt.getTime() - Date.now(),
  );

  res.cookie("access_token", options.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: accessMaxAge,
    path: "/",
  });

  res.cookie("refresh_token", options.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: refreshMaxAge,
    path: "/",
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/" });
}

