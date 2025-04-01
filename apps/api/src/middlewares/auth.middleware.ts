import type { NextFunction, Request, Response } from "express";

export async function authenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ message: "Not Authenticated" });
}
