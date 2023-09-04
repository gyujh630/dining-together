import pool from '../config/dbConfig';

export interface StoreImage {
  imageId?: number;
  imageUrl: string;
  storeId: number;
}

// 이미지 추가
export const addImageToStore = async (
  storeId: number,
  imageUrl: string
): Promise<number> => {
  try {
    const insertImageQuery = `
      INSERT INTO STOREIMAGE (imageUrl, storeId) VALUES (?, ?);
    `;
    const [result] = await pool.query(insertImageQuery, [imageUrl, storeId]);

    return (result as any).insertId as number;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add image to store');
  }
};

// 특정 가게의 전체 이미지 조회
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

// 특정 가게의 특정 이미지 조회
export const getImageByImageId = async (
  imageId: number
): Promise<StoreImage[] | null> => {
  try {
    const query = `
    SELECT * FROM STOREIMAGE WHERE ImageId = ?;
  `;
    const [rows] = await pool.query(query, [imageId]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as StoreImage[];
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete image');
  }
};

// 특정 가게의 특정 이미지 업데이트
export const updateImageByImageId = async (
  imageId: number,
  imageUrl: string
): Promise<void> => {
  try {
    const updateQuery = `
      UPDATE STOREIMAGE
      SET imageUrl = ?
      WHERE imageId = ? ;
    `;

    await pool.query(updateQuery, [imageUrl, imageId]);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update image in store');
  }
};
