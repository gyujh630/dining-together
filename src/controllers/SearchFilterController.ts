import { Request, Response } from 'express';
import {
  getAllStoresBySearch,
  getAllStoresByFilter,
} from '../models/SearchFilterModel';

// 검색 조회 (가게명, 키워드)
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

// 필터 조회 (날짜, 지역, 음식유형, 인당 가격, 분위기, 룸 유무)
export const filterStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { location, foodCategory, cost, mood, isRoom } = req.query;
    const FilterResultes: any[] = [];

    if (location && typeof location === 'string') {
      const storeResults = await getAllStoresByFilter(
        location,
        undefined,
        undefined,
        undefined,
        undefined
      );
      FilterResultes.push(...storeResults);
    }
    if (foodCategory && typeof foodCategory === 'string') {
      const keywordResults = await getAllStoresByFilter(
        undefined,
        foodCategory,
        undefined,
        undefined,
        undefined
      );
      FilterResultes.push(...keywordResults);
    }
    if (cost && typeof cost === 'number') {
      const keywordResults = await getAllStoresByFilter(
        undefined,
        undefined,
        cost,
        undefined,
        undefined
      );
      FilterResultes.push(...keywordResults);
    }
    if (mood && typeof mood === 'string') {
      const keywordResults = await getAllStoresByFilter(
        undefined,
        undefined,
        undefined,
        mood,
        undefined
      );
      FilterResultes.push(...keywordResults);
    }
    if (isRoom && typeof isRoom === 'number') {
      const keywordResults = await getAllStoresByFilter(
        undefined,
        undefined,
        undefined,
        undefined,
        isRoom
      );
      FilterResultes.push(...keywordResults);
    }
    res.status(200).json(FilterResultes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to filter stores' });
  }
};
