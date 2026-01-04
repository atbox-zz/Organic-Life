import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // 登入端點 - 重定向到 Manus OAuth 授權伺服器
  app.get("/api/auth/login", async (req: Request, res: Response) => {
    try {
      // 使用 Manus 內建的授權流程
      const redirectUri = `${process.env.VITE_APP_DOMAIN || 'http://localhost:3000'}/api/oauth/callback`;
      const state = Buffer.from(redirectUri).toString('base64');
      const authorizationUrl = `${process.env.OAUTH_SERVER_URL}/oauth/authorize?client_id=${process.env.VITE_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&response_type=code`;
      res.redirect(302, authorizationUrl);
    } catch (error) {
      console.error("[OAuth] Login failed", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // OAuth callback is handled by Manus framework automatically
  // This endpoint is just a placeholder for documentation
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    // Manus framework handles OAuth callback automatically
    // Just redirect to home if somehow this is called directly
    res.redirect(302, "/");
  });

  // Logout endpoint
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      res.clearCookie(COOKIE_NAME);
      res.json({ success: true });
    } catch (error) {
      console.error("[OAuth] Logout failed", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // Logout endpoint (GET version for direct logout links)
  app.get("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      res.clearCookie(COOKIE_NAME);
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Logout failed", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });
}
