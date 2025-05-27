import { Request, Response, NextFunction } from 'express';
import { db } from '../services/db';

export const getAllKarigars = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const list = await db.karigar.findMany();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const getKarigarById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const karigar = await db.karigar.findUnique({
      where: { id: req.params.id }
    });
    if (!karigar) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(karigar);
  } catch (err) {
    next(err);
  }
};

export const createKarigar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, skills, status } = req.body;
    const created = await db.karigar.create({
      data: { name, email, skills, status }
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateKarigarStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const updated = await db.karigar.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
