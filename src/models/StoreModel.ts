import pool from '../config/dbConfig';
import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { StoreImage, addImageToStore } from './StoreImageModel';
import { seoulRegionList, convertUtcToKoreaTime } from '../utils/string-util';

export interface Store {
  storeId?: number; // 자동 생성
  userId: number;
  storeName: string;
  storeContact: string;
  address: {
    postalCode: string; // 우편번호 (12345)
    roadAddress: string; // 도로명주소 (경기도 성남시 분당구 미금일로 74번길 15)
    detailAddress: string; // 상세주소 (205호)
  };
  location: string; // 필터용 지역
  description: string;
  keyword: string;
  mood: string;
  operatingHours: {
    openingHour: string;
    openingMinute: string;
    closingHour: string;
    closingMinute: string;
  };
  closedDays: string;
  foodCategory: string;
  maxNum: number;
  cost: number;
  isParking: number; // 주차공간 => 0 : 없음, 1 : 있음
  isRoom: boolean;
  createdAt?: Date; // 자동 생성
  modifiedAt?: Date; // 자동 업데이트
  averageRating: number;
  reviewCount: number;
  isDeleted: boolean;
}

// 가게 추가
export const createStore = async (
  store: Store,
  images: string[]
): Promise<number> => {
  try {
    const nowUtc = new Date();
    const koreaCreatedAt = convertUtcToKoreaTime(nowUtc);
    const koreaModifiedAt = koreaCreatedAt;

    const query = `
      INSERT INTO STORE
        (userId, storeName, storeContact, address, location, description, keyword, mood, operatingHours, closedDays, foodCategory, maxNum, cost, isParking, isRoom, createdAt, modifiedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      store.userId,
      store.storeName,
      store.storeContact,
      JSON.stringify(store.address),
      store.location,
      store.description,
      store.keyword,
      store.mood,
      JSON.stringify(store.operatingHours),
      store.closedDays,
      store.foodCategory,
      store.maxNum,
      store.cost,
      store.isParking,
      store.isRoom,
      koreaCreatedAt,
      koreaModifiedAt,
    ];

    const [result] = await pool.query(query, values);
    const storeId = (result as any).insertId as number;

    for (const imagePath of images) {
      const randomImagePath = `${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}${path.extname(imagePath)}`;
      await addImageToStore(storeId, randomImagePath);
    }

    return storeId;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create store');
  }
};

// 가게 전체 조회(관리자)
export const getAllStores = async (): Promise<Store[]> => {
  try {
    const query = `
      SELECT s.*, MIN(si.imageUrl) AS imageUrl
      FROM STORE s
      LEFT JOIN STOREIMAGE si ON s.storeId = si.storeId
      GROUP BY s.storeId;
    `;
    const [rows] = await pool.query(query);
    return rows as Store[];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch stores');
  }
};

// 가게 전체 조회(사용자)
export const getAllStoresNotDel = async (): Promise<Store[]> => {
  try {
    const query = `
      SELECT * FROM STORE WHERE isDeleted = 0;
    `;
    const [rows] = await pool.query(query);
    return rows as Store[];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch stores');
  }
};

// 특정 가게 조회
export const getStoreById = async (storeId: number): Promise<Store | null> => {
  try {
    const query = `
      SELECT STORE.*, STOREIMAGE.imageUrl
      FROM STORE 
      LEFT JOIN STOREIMAGE ON STORE.storeId = STOREIMAGE.storeId
      WHERE STORE.storeId = ? AND STORE.isDeleted = 0;
    `;

    const [rows] = await pool.query(query, [storeId]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Store;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch store');
  }
};

// 가게 정보 수정
export const updateStore = async (
  storeId: number,
  updatedStore: Store,
  imagePath: string | undefined
): Promise<void> => {
  try {
    const nowUtc = new Date();
    const koreaModifiedAt = convertUtcToKoreaTime(nowUtc);

    const updateFields = Object.entries(updatedStore)
      .filter(([key, value]) => value !== undefined && key !== 'storeId')
      .map(([key]) => `${key} = ?`)
      .join(', ');

    if (!updateFields) {
      throw new Error('No fields to update');
    }

    const values = Object.entries(updatedStore)
      .filter(([key, value]) => value !== undefined && key !== 'storeId')
      .map(([key, value]) => value);

    const updateStoreQuery = `
      UPDATE STORE
      SET ${updateFields}, modifiedAt = ?
      WHERE storeId = ?;
    `;

    values.push(koreaModifiedAt, storeId);
    await pool.query(updateStoreQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update store');
  }
};

// 가게 삭제
export const deleteStore = async (storeId: number): Promise<void> => {
  try {
    const query = `
      DELETE FROM STORE WHERE storeId = ?;
    `;
    await pool.query(query, [storeId]);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete store');
  }
};

export const getHomeWhenLogin = async (
  userId: number,
  userType: number
): Promise<any> => {
  const randomRegion =
    seoulRegionList[Math.floor(Math.random() * seoulRegionList.length)];

  try {
    //지역 랜덤 추천 쿼리
    const regionRandomQuery = `
      SELECT S.storeId, S.storeName, S.foodCategory FROM STORE S
      WHERE S.location = ? AND S.isDeleted = 0
      ORDER BY RAND()
      LIMIT 10;
    `;

    //30인 이상 단체 가능 쿼리
    const bigStoreQuery = `
      SELECT S.storeId, storeName, foodCategory
      FROM STORE S
      JOIN (
        SELECT MAX(P.maxPeople) AS maxPeople, P.storeId
        FROM PLACE P
        GROUP BY P.storeId
      ) AS MaxPlaces
      ON S.storeId = MaxPlaces.storeId
      WHERE MaxPlaces.maxPeople >= 30
      LIMIT 10;
    `;

    //새로 입점 쿼리
    const newStoreQuery = `
      SELECT storeId, storeName, foodCategory FROM STORE
      ORDER BY createdAt DESC
      LIMIT 10;
    `;

    const [regionRandomList] = await pool.query(regionRandomQuery, [
      randomRegion,
    ]);
    const [bigList] = await pool.query(bigStoreQuery);
    const [newStoreList] = await pool.query(newStoreQuery);

    // 동적인 속성 이름을 사용하여 객체 생성
    const result: { [key: string]: any } = {
      [randomRegion]: regionRandomList,
      '30인 이상 단체 가능!': bigList,
      '새로 입점했어요': newStoreList,
    };

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get home');
  }
};

export const getHomeWhenNotLogin = async (): Promise<any> => {
  const randomRegion =
    seoulRegionList[Math.floor(Math.random() * seoulRegionList.length)];

  try {
    //지역 랜덤 추천 쿼리
    const regionRandomQuery = `
      SELECT S.storeId, S.storeName, S.foodCategory, SI.imageUrl
      FROM STORE S
      LEFT JOIN
      STOREIMAGE SI ON S.storeId = SI.storeId
      WHERE S.location = ? AND S.isDeleted = 0
      AND SI.imageId = (
        SELECT MIN(imageId)
        FROM STOREIMAGE
        WHERE storeId = S.storeId
        )
      ORDER BY RAND()
      LIMIT 10;
    `;

    //30인 이상 단체 가능 쿼리
    const bigStoreQuery = `
      SELECT S.storeId, storeName, foodCategory
      FROM STORE S
      JOIN (
        SELECT MAX(P.maxPeople) AS maxPeople, P.storeId
        FROM PLACE P
        GROUP BY P.storeId
      ) AS MaxPlaces
      ON S.storeId = MaxPlaces.storeId
      WHERE MaxPlaces.maxPeople >= 30
      LIMIT 10;
    `;

    //새로 입점 쿼리
    const newStoreQuery = `
      SELECT storeId, storeName, foodCategory FROM STORE
      ORDER BY createdAt DESC
      LIMIT 10;
    `;

    // const [regionRandomList] = await pool.query(regionRandomQuery, [
    //   randomRegion,
    // ]);
    const [regionRandomList] = await pool.query(regionRandomQuery, ['강남']);
    const [bigList] = await pool.query(bigStoreQuery);
    const [newStoreList] = await pool.query(newStoreQuery);

    // 동적인 속성 이름을 사용하여 객체 생성
    const result: { [key: string]: any } = {
      [randomRegion]: regionRandomList,
      '30인 이상 단체 가능!': bigList,
      '새로 입점했어요': newStoreList,
    };

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get home');
  }
};

// 공간 추가 시 공간 유형이 룸인 경우 isRoom true로 업뎃
export const updateIsRoomTrue = async (storeId: number): Promise<void> => {
  try {
    const nowUtc = new Date();
    const koreaModifiedAt = convertUtcToKoreaTime(nowUtc);

    const updateStoreQuery = `
      UPDATE STORE
      SET isRoom = TRUE, modifiedAt = ?
      WHERE storeId = ?;
    `;

    const values = [];

    values.push(koreaModifiedAt, storeId);
    await pool.query(updateStoreQuery, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update store');
  }
};

export default Store;
