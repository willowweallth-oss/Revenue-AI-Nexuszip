import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export async function verifyAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).userId) {
    req.user = {
      id: (req.session as any).userId,
      email: (req.session as any).userEmail,
    };
    return next();
  }

  return res.status(401).json({ message: "Unauthorized: Please log in" });
}