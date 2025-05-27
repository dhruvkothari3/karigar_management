import { Request, Response, NextFunction } from 'express';
import { db } from '../services/db';

export const getAllAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const list = await db.assignment.findMany();
    res.json(list);    // no return
  } catch (err) {
    next(err);
  }
};

export const getAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const item = await db.assignment.findUnique({
      where: { id: req.params.id }
    });

    if (!item) {
      res.status(404).json({ message: 'Not found' });
      return;         // early exit, returns void
    }

    res.json(item);   // no return
  } catch (err) {
    next(err);
  }
};

export const createAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, tasks, materials, status, karigarId } = req.body;
    const created = await db.assignment.create({
      data: { title, description, tasks, materials, status, karigarId }
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await db.assignment.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await db.assignment.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
