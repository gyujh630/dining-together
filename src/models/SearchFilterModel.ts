import pool from '../config/dbConfig';
import Store from './StoreModel';

// 식당명, 키워드 검색 조회
export const getAllStoresBySearch = async (
  storeName: string | undefined,
  keyword: string | undefined
): Promise<Store[]> => {
  try {
    const searchQuery = `
      SELECT STORE.*, STOREIMAGE.imageUrl 
      FROM STORE
      LEFT JOIN STOREIMAGE ON STORE.storeId = STOREIMAGE.storeId  
      WHERE storeName LIKE ? OR keyword LIKE ?;
    `;

    const values = [`%${storeName}%`, `%${keyword}%`];

    const [rows] = await pool.query(searchQuery, values);
    return rows as Store[];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch stores');
  }
};

// 날짜, 지역, 음식유형, 인당 가격, 분위기, 룸 유무 필터 조회
export const getAllStoresByFilter = async (
  location: string | undefined,
  foodCategory: string | undefined,
  cost: number | undefined,
  mood: string | undefined,
  isRoom: number | undefined
): Promise<Store[]> => {
  try {
    const filterQuery = `
      SELECT STORE.*, STOREIMAGE.imageUrl 
      FROM STORE
      LEFT JOIN STOREIMAGE ON STORE.storeId = STOREIMAGE.storeId  
      WHERE storeName LIKE ? OR keyword LIKE ?;
    `;

    const values = [
      `%${location}%`,
      `%${foodCategory}%`,
      `%${cost}%`,
      `%${mood}%`,
      `%${isRoom}%`,
    ];

    const [rows] = await pool.query(filterQuery, values);
    return rows as Store[];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch stores');
  }
};
