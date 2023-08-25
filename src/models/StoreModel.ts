import pool from '../config/dbConfig';
import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { StoreImage, addImageToStore } from './StoreImageModel';
import { seoulRegionList } from '../utils/string-util';

// UTC 시간을 한국 시간으로 변환하는 함수
const convertUtcToKoreaTime = (utcDate: Date): Date => {
  const koreaOffset = 9 * 60 * 60 * 1000; // 한국 : UTC+9
  const koreaTime = new Date(utcDate.getTime() + koreaOffset);
  return koreaTime;
};

// 파일 저장 경로 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/stores');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}${extname}`;
    cb(null, filename);
  },
});

// 파일 업로드 설정
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

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
  operatingHours: string;
  closedDays: string;
  foodCategory: string;
  maxNum: number;
  cost: number;
  isParking: boolean;
  createdAt?: Date; // 자동 생성
  modifiedAt?: Date; // 자동 업데이트
  averageRating: number;
  reviewCount: number;
  isDeleted: boolean;
  // storeImage: StoreImage[]; // STOREIMAGE 테이블의 imageId 배열
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
        (userId, storeName, storeContact, address, location, description, keyword, operatingHours, closedDays, foodCategory, maxNum, cost, isParking, createdAt, modifiedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      store.userId,
      store.storeName,
      store.storeContact,
      JSON.stringify(store.address),
      store.location,
      store.description,
      store.keyword,
      store.operatingHours,
      store.closedDays,
      store.foodCategory,
      store.maxNum,
      store.cost,
      store.isParking,
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
      SELECT * FROM STORE;
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
      SELECT * FROM STORE WHERE storeId = ? AND isDeleted = 0;
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

    const updateStoreQuery = `
      UPDATE STORE
      SET ${updateFields}, modifiedAt = ?
      WHERE storeId = ?;
    `;

    const values = Object.entries(updatedStore)
      .filter(([key, value]) => value !== undefined && key !== 'storeId')
      .map(([key, value]) => value);

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
      SELECT storeId, storeName, foodCategory FROM STORE
      WHERE location = ?
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
      SELECT storeId, storeName, foodCategory FROM STORE
      WHERE location = ?
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

export default Store;
