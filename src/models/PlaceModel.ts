import pool from '../config/dbConfig';

export interface Place {
  placeId?: number; // 자동 생성
  storeId: number;
  placeName: string;
  placeType: string;
  placeImageUrl: string;
  maxPeople: number;
  minPeople: number;
  createdAt?: Date; // 자동 생성
  modifiedAt?: Date; // 자동 업데이트
}

export const createPlace = async (place: Place): Promise<number> => {
  try {
    const query = `
      INSERT INTO PLACE
      (storeId, placeName, placeType, placeImageUrl, maxPeople, minPeople)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
    const values = [
      place.storeId,
      place.placeName,
      place.placeType,
      place.placeImageUrl,
      place.maxPeople,
      place.minPeople,
    ];
    const [result] = await pool.query(query, values);
    return (result as any).insertId as number;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create place');
  }
};

export const getPlaceById = async (storeId: number): Promise<Place | null> => {
  try {
    const query = `
        SELECT * FROM PLACE WHERE storeId = ?;
      `;
    const [rows] = await pool.query(query, [storeId]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Place;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch place');
  }
};

export default Place;
