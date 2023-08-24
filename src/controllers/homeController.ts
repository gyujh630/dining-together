import { Request, Response } from 'express';
import { getAllStoresNotDel } from '../models/index';

// 가게 전체 조회
export const getAllStoresAtHome = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stores = await getAllStoresNotDel();
    res.status(200).json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};
