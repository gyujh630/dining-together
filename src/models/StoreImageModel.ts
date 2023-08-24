import pool from '../config/dbConfig';
import { Store } from './StoreModel';

export interface StoreImage {
  imageId?: number;
  imageUrl: string;
  storeId: number;
}

// 이미지 추가
export const createStoreImage = async (image: StoreImage): Promise<number> => {
  try {
    const query = `
      INSERT INTO STOREIMAGE (imageUrl, storeId) VALUES (?, ?);
    `;
    const values = [image.imageUrl, image.storeId];
    const [result] = await pool.query(query, values);
    return (result as any).insertId as number;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add image to store');
  }
};

// 특정 가게의 이미지 목록 조회
export const getImagesByStoreId = async (
  storeId: number
): Promise<StoreImage[]> => {
  try {
    const query = `
      SELECT * FROM STOREIMAGE WHERE storeId = ?;
    `;
    const [rows] = await pool.query(query, [storeId]);
    return rows as StoreImage[];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch store images');
  }
};

// 특정 이미지 삭제
export const deleteImage = async (imageId: number): Promise<void> => {
  try {
    const query = `
      DELETE FROM STOREIMAGE WHERE imageId = ?;
    `;
    await pool.query(query, [imageId]);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete image');
  }
};
