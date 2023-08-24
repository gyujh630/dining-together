import pool from '../config/dbConfig';
import multer from 'multer';
import path from 'path';

// UTC 시간을 한국 시간으로 변환하는 함수
const convertUtcToKoreaTime = (utcDate: Date): Date => {
  const koreaOffset = 9 * 60 * 60 * 1000; // 한국 : UTC+9
  const koreaTime = new Date(utcDate.getTime() + koreaOffset);
  return koreaTime;
};

// 파일 저장 경로 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/places/');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${Date.now()}${extname}`;
    cb(null, filename);
  },
});

// 파일 업로드 설정
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export interface Place {
  placeId?: number; // 자동 생성
  storeId: number;
  placeName: string;
  placeType: string;
  placeImage: string;
  maxPeople: number;
  minPeople: number;
  createdAt?: Date; // 자동 생성
  modifiedAt?: Date; // 자동 업데이트
}

// 특정 가게의 공간 추가
export const createPlace = async (place: Place): Promise<number> => {
  try {
    const nowUtc = new Date();
    const koreaCreatedAt = convertUtcToKoreaTime(nowUtc);
    const koreaModifiedAt = koreaCreatedAt;

    const query = `
      INSERT INTO PLACE
      (storeId, placeName, placeType, placeImage, maxPeople, minPeople, createdAt, modifiedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;

    const values = [
      place.storeId,
      place.placeName,
      place.placeType,
      place.placeImage,
      place.maxPeople,
      place.minPeople,
      koreaCreatedAt,
      koreaModifiedAt,
    ];
    const [result] = await pool.query(query, values);
    return (result as any).insertId as number;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create place');
  }
};

// 특정 가게의 공간 전체 조회
export const getPlaceByStoreId = async (storeId: number): Promise<Place[]> => {
  try {
    const query = `
        SELECT * FROM PLACE WHERE storeId = ?;
      `;
    const [rows] = await pool.query(query, [storeId]);
    return rows as Place[];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch place');
  }
};

// 특정 가게의 특정 공간 조회
export const getPlaceByStorePlaceId = async (
  storeId: number,
  placeId: number
): Promise<Place | null> => {
  try {
    const query = `
        SELECT * FROM PLACE WHERE storeId = ? AND placeId = ?;
      `;
    const [rows] = await pool.query(query, [storeId, placeId]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Place;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch place');
  }
};

// 특정 가게의 특정 공간 정보 수정
export const updatePlace = async (
  storeId: number,
  placeId: number,
  updatedPlace: Place
): Promise<void> => {
  try {
    const nowUtc = new Date();
    const koreaModifiedAt = convertUtcToKoreaTime(nowUtc);
    const updateFields = Object.entries(updatedPlace)
      .filter(([key, value]) => value !== undefined && key !== 'placeId')
      .map(([key]) => `${key} = ?`)
      .join(', ');

    if (!updateFields) {
      throw new Error('No fields to update');
    }

    const updatePlaceQuery = `
      UPDATE PLACE
      SET ${updateFields}, modifiedAt = ?
      WHERE storeId = ? AND placeId = ?;
    `;

    const values = Object.entries(updatedPlace)
      .filter(([key, value]) => value !== undefined && key !== 'placeId')
      .map(([key, value]) => value);

    values.push(koreaModifiedAt, storeId, placeId);
    await pool.query(updatePlaceQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update place');
  }
};

export default Place;
