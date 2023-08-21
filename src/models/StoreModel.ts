import pool from '../config/dbConfig';

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
    const [result] = await pool.query(query, values);
    return (result as any).insertId as number;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create store');
  }
};

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

export const getStoreById = async (storeId: number): Promise<Store | null> => {
  try {
    const query = `
      SELECT * FROM STORE WHERE storeId = ?;
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

export const updateStore = async (
  storeId: number,
  updatedStore: Store
): Promise<void> => {
  try {
    const query = `
      UPDATE STORE
      SET
        userId = ?, storeName = ?, storeImageUrl = ?, storeContact = ?, address = ?, description = ?,
        operatingHours = ?, closedDays = ?, foodCategory = ?, maxNum = ?, cost = ?, isParking = ?,
        averageRating = ?, reviewCount = ?, isDeleted = ?
      WHERE storeId = ?;
    `;
    const values = [
      updatedStore.userId,
      updatedStore.storeName,
      updatedStore.storeImageUrl,
      updatedStore.storeContact,
      JSON.stringify(updatedStore.address),
      updatedStore.description,
      updatedStore.operatingHours,
      updatedStore.closedDays,
      updatedStore.foodCategory,
      updatedStore.maxNum,
      updatedStore.cost,
      updatedStore.isParking,
      updatedStore.averageRating,
      updatedStore.reviewCount,
      updatedStore.isDeleted,
      storeId,
    ];
    await pool.query(query, values);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update store');
  }
};

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

export default Store;
