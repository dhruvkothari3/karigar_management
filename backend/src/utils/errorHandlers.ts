// src/utils/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  const message =
    err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({ message });
}
