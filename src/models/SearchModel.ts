import pool from '../config/dbConfig';
import Store from './StoreModel';

// 식당명, 키워드 검색 조회
export const getAllStoresBySearch = async (
  storeName: string | undefined,
  keyword: string | undefined
): Promise<Store[]> => {
  try {
    const searchQuery = `
      SELECT * FROM STORE
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
