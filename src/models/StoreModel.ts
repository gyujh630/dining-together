import db from '../config/dbConfig';

export interface Store {
  storeId?: number; // 자동 생성
  userId: number;
  storeName: string;
  storeImageUrl: string;
  storeContact: string;
  address: object;
  description: string;
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
}

export const createStore = async (store: Store): Promise<number> => {
  try {
    const query = `
      INSERT INTO STORE
        (userId, storeName, storeImageUrl, storeContact, address, description, operatingHours, closedDays, foodCategory, maxNum, cost, isParking, averageRating, reviewCount, isDeleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [
      store.userId,
      store.storeName,
      store.storeImageUrl,
      store.storeContact,
      JSON.stringify(store.address),
      store.description,
      store.operatingHours,
      store.closedDays,
      store.foodCategory,
      store.maxNum,
      store.cost,
      store.isParking,
      store.averageRating,
      store.reviewCount,
      store.isDeleted,
    ];
    const [result] = await db.query(query, values);
    return (result as any).insertId as number;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create store');
  }
};

export const getStoreById = async (storeId: number): Promise<Store | null> => {
  try {
    const query = `
      SELECT * FROM STORE WHERE storeId = ?;
    `;
    const [rows] = await db.query(query, [storeId]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Store;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch store');
  }
};

export default Store;
