import pool from '../config/dbConfig';
import Store from './StoreModel';

// 식당명, 키워드 검색 조회
export const getAllStoresBySearch = async (
  searchItem: string
): Promise<Store[]> => {
  try {
    const searchQuery = `
      SELECT STORE.*, STOREIMAGE.imageUrl 
      FROM STORE
      LEFT JOIN STOREIMAGE ON STORE.storeId = STOREIMAGE.storeId  
      WHERE storeName LIKE ? OR keyword LIKE ?;
    `;

    const values = [`%${searchItem}%`, `%${searchItem}%`];

    const [rows] = await pool.query(searchQuery, values);
    return rows as Store[];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch stores');
  }
};

// 날짜, 지역, 음식유형, 인당 가격, 분위기, 룸 유무 필터 조회
export const getAllStoresByFilter = async (
  selectedDate: string | undefined,
  location: string | undefined,
  foodCategories: string[] | undefined,
  minCost: number | undefined,
  maxCost: number | undefined,
  moods: string[] | undefined,
  isRoom: number | undefined
): Promise<Store[]> => {
  try {
    const values = [];
    const filterConditions = [];
    const groupByClause = 'GROUP BY s.storeId';

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

    if (isRoom) {
      values.push(isRoom);
      filterConditions.push(`s.isRoom = ?`);
    }

    const filterQuery = `
      SELECT s.*, MAX(si.imageUrl) as imageUrl
      FROM STORE s
      LEFT JOIN STOREIMAGE si ON s.storeId = si.storeId  
      ${values.length > 0 ? 'INNER JOIN PLACE p ON s.storeId = p.storeId' : ''}
      ${filterConditions.length > 0 ? 'WHERE' : ''} ${filterConditions.join(
        ' AND '
      )}
      ${groupByClause}
    `;

    console.log(filterQuery);
    console.log(values);

    const [rows] = await pool.query(filterQuery, values);

    return rows as Store[];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch stores');
  }
};
