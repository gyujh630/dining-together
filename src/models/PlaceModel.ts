import pool from '../config/dbConfig';
import multer from 'multer';
import path from 'path';
import { isDateCloseDay, isValidCloseDay } from '../utils/string-util';

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
  isDeleted: boolean;
}

// 특정 가게의 공간 추가
export const createPlace = async (place: Place): Promise<number> => {
  try {
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
    ];
    const [result] = await pool.query(query, values);
    return (result as any).insertId as number;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create place');
  }
};

// 특정 가게의 공간 전체 조회
export const getPlacesByStoreId = async (storeId: number): Promise<Place[]> => {
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
export const getPlaceByPlaceId = async (
  placeId: number
): Promise<Place | null> => {
  try {
    const query = `
        SELECT * FROM PLACE WHERE placeId = ?;
      `;
    const [rows] = await pool.query(query, placeId);
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
  placeId: number,
  updatedPlace: Place
): Promise<void> => {
  try {
    const modifiedAt = new Date();

    let updateFields = Object.entries(updatedPlace)
      .filter(([key, value]) => value !== undefined && key !== 'placeId')
      .map(([key]) => `${key} = ?`)
      .join(', ');

    if (!updateFields) {
      throw new Error('No fields to update');
    }

    const values = Object.entries(updatedPlace)
      .filter(([key, value]) => value !== undefined && key !== 'placeId')
      .map(([key, value]) => value);

    const updatePlaceQuery = `
      UPDATE PLACE
      SET ${updateFields}, modifiedAt = ?
      WHERE placeId = ?;
    `;

    values.push(modifiedAt, placeId);
    await pool.query(updatePlaceQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update place');
  }
};

// 예약 가능 공간 조회
export async function findAvailablePlacesByDate(
  storeId: number,
  date: string
): Promise<Place[]> {
  try {
    // 해당 날짜에 예약 가능한 예약목록을 가져옴
    const query = `
      SELECT DISTINCT p.*
      FROM PLACE p
      WHERE p.storeId = ? 
      AND p.placeId NOT IN (
        SELECT r.placeId
        FROM RESERVATION r
        WHERE r.reservedDate = ?
        AND (r.status != '예약취소')
      )
    `;

    const [rows] = await pool.query(query, [storeId, date]);

    return rows as Place[];
  } catch (error) {
    console.error(error);
    throw new Error('Error finding available places');
  }
}

export default Place;
