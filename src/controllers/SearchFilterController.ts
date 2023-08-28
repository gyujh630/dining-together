import { Request, Response } from 'express';
import {
  getAllStoresBySearch,
  getAllStoresByFilter,
} from '../models/SearchFilterModel';

// 검색 조회 (가게명, 키워드)
export const searchStoresHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { storeName, keyword } = req.query;
  try {
    const searchResultes = await getAllStoresBySearch(
      storeName as string | undefined,
      keyword as string | undefined
    );
    res.status(200).json(searchResultes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search stores' });
  }
};

// 필터 조회 (날짜, 지역, 음식유형, 인당 가격, 분위기, 룸 유무)
export const filterStoresHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { selectedDate, location, foodCategory, cost, mood, isRoom } =
    req.query;
  try {
    const filterResults = await getAllStoresByFilter(
      selectedDate as string | undefined,
      location as string | undefined,
      foodCategory as string | undefined,
      parseInt(cost as string) || undefined,
      mood as string | undefined,
      parseInt(isRoom as string) || undefined
    );

    res.status(200).json(filterResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to filter stores' });
  }
};
