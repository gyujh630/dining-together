import { Request, Response } from 'express';
import { getAllStoresBySearch } from '../models/SearchModel';

// 가게 전체 조회
export const searchStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Invalid search query' });
    }

    const searchResultes = await getAllStoresBySearch(query as string);

    res.status(200).json(searchResultes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search stores' });
  }
};
