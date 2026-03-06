import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yqudyhorxqkneukoegwf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdWR5aG9yeHFrbmV1a29lZ3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTI5NTQsImV4cCI6MjA4ODMyODk1NH0.bFqd9qcIsR5Q2UVkPe_B1lVh78AoX76sVBf1m2VZb1c";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export async function verifyAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (err) {
    console.error("[auth-middleware] Error verifying token:", err);
    return res.status(500).json({ message: "Internal server error during authentication" });
  }
}