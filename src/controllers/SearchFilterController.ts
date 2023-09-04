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
  const { page, searchItem } = req.query;
  try {
    const pageNumber = parseInt(page as string) || 1; // 페이지 번호
    const itemsPerPage = 10; // 페이지당 가게 개수

    const [searchResultes, totalCount] = await getAllStoresBySearch(
      searchItem as string,
      pageNumber,
      itemsPerPage
    );

    const isLastPage = searchResultes.length < itemsPerPage;

    res.status(200).json({ stores: searchResultes, totalCount, isLastPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search stores' });
  }
};

// 필터 조회 (날짜, 지역, 음식유형, 인당 가격, 분위기, 룸 유형)
export const filterStoresHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    page,
    selectedDate,
    location,
    foodCategory,
    minCost,
    maxCost,
    mood,
    room,
  } = req.query;
  try {
    const foodCategoryArray = foodCategory
      ? (foodCategory as string).split(',')
      : undefined;
    const moodArray = mood ? (mood as string).split(',') : undefined;
    const roomArray = room ? (room as string).split(',') : undefined;

    const pageNumber = parseInt(page as string) || 1; // 페이지 번호
    const itemsPerPage = 10; // 페이지당 가게 개수

    const [filterResults, totalCount] = await getAllStoresByFilter(
      selectedDate as string | undefined,
      location as string | undefined,
      foodCategoryArray,
      parseInt(minCost as string) || undefined,
      parseInt(maxCost as string) || undefined,
      moodArray,
      roomArray,
      pageNumber,
      itemsPerPage
    );

    const isLastPage = filterResults.length < itemsPerPage;

    res.status(200).json({ stores: filterResults, totalCount, isLastPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to filter stores' });
  }
};
