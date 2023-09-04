import pool from '../config/dbConfig';
import Store from './StoreModel';

// 식당명, 키워드 검색 조회
export const getAllStoresBySearch = async (
  searchItem: string,
  pageNumber: number,
  itemsPerPage: number
): Promise<[Store[], number]> => {
  try {
    const startIndex = (pageNumber - 1) * itemsPerPage;

    const searchQuery = `
      SELECT s.*, si.imageUrl
      FROM STORE s
      LEFT JOIN (
        SELECT storeId, MIN(imageUrl) as imageUrl
        FROM STOREIMAGE
        GROUP BY storeId
        ) si ON s.storeId = si.storeId  
      WHERE storeName LIKE ? OR keyword LIKE ?
      LIMIT ${startIndex}, ${itemsPerPage};
    `;

    const countQuery = `
      SELECT COUNT(*) as totalCount
      FROM STORE
      WHERE storeName LIKE ? OR keyword LIKE ?;
    `;

    const values = [`%${searchItem}%`, `%${searchItem}%`];

    const [rows] = await pool.query(searchQuery, values);
    const [totalCountRows]: any[] = await pool.query(countQuery, values);
    const totalCount = totalCountRows[0].totalCount;

    return [rows as Store[], totalCount];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch stores');
  }
};

// 날짜, 지역, 음식유형, 인당 가격, 분위기, 룸 필터 조회
export const getAllStoresByFilter = async (
  selectedDate: string | undefined,
  location: string | undefined,
  foodCategories: string[] | undefined,
  minCost: number | undefined,
  maxCost: number | undefined,
  moods: string[] | undefined,
  rooms: string[] | undefined,
  pageNumber: number,
  itemsPerPage: number
): Promise<[Store[], number]> => {
  try {
    const values = [];
    const filterConditions = [];

    if (selectedDate) {
      values.push(selectedDate);
      filterConditions.push(`p.placeId NOT IN (
        SELECT r.placeId
        FROM RESERVATION r
        WHERE r.reservedDate = ?
        AND (r.status != '예약취소') 
      )`);
    }

    if (location) {
      values.push(location);
      filterConditions.push(`s.location LIKE ?`);
    }

    if (foodCategories) {
      const foodCategoryConditions = foodCategories.map(
        () => 's.foodCategory = ?'
      );
      filterConditions.push(`(${foodCategoryConditions.join(' OR ')})`);
      values.push(...foodCategories.map((category) => `${category}`));
    }

    if (minCost !== undefined && maxCost !== undefined) {
      values.push(minCost, maxCost);
      filterConditions.push(`s.cost BETWEEN ? AND ?`);
    } else if (minCost !== undefined) {
      values.push(minCost);
      filterConditions.push(`s.cost >= ?`);
    } else if (maxCost !== undefined) {
      values.push(maxCost);
      filterConditions.push(`s.cost <= ?`);
    }

    if (moods) {
      const moodConditions = moods.map(() => 's.mood LIKE ?');
      filterConditions.push(`(${moodConditions.join(' OR ')})`);
      values.push(...moods.map((mood) => `%${mood}%`));
    }

    if (rooms) {
      const placeTypeConditions = rooms.map(() => 'p.placeType = ?');
      filterConditions.push(`(${placeTypeConditions.join(' OR ')})`);
      values.push(...rooms.map((roomType) => `${roomType}`));
    }

    const startIndex = (pageNumber - 1) * itemsPerPage;

    const filterQuery = `
      SELECT s.*, MIN(si.imageUrl) as imageUrl
      FROM STORE s
      LEFT JOIN STOREIMAGE si ON s.storeId = si.storeId  
      ${values.length > 0 ? 'INNER JOIN PLACE p ON s.storeId = p.storeId' : ''}
      ${filterConditions.length > 0 ? 'WHERE' : ''} ${filterConditions.join(
        ' AND '
      )}
      GROUP BY s.storeId
      LIMIT ${startIndex}, ${itemsPerPage}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT s.storeId) as totalCount
      FROM STORE s
      ${values.length > 0 ? 'INNER JOIN PLACE p ON s.storeId = p.storeId' : ''}
      ${filterConditions.length > 0 ? 'WHERE' : ''} ${filterConditions.join(
        ' AND '
      )}
    `;

    const [rows] = await pool.query(filterQuery, values);
    const [totalCountRows]: any[] = await pool.query(countQuery, values);
    const totalCount = totalCountRows[0].totalCount;

    return [rows as Store[], totalCount];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch stores');
  }
};
