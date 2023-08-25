import { Request, Response } from 'express';
import { getAllStoresBySearch } from '../models/SearchModel';

// 가게 전체 조회
export const searchStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { storeName, keyword } = req.query;
    const searchResultes: any[] = [];

    if (storeName && typeof storeName === 'string') {
      const storeResults = await getAllStoresBySearch(storeName, undefined);
      searchResultes.push(...storeResults);
    }
    if (keyword && typeof keyword === 'string') {
      const keywordResults = await getAllStoresBySearch(undefined, keyword);
      searchResultes.push(...keywordResults);
    }
    res.status(200).json(searchResultes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search stores' });
  }
};
