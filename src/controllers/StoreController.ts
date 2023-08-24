import { Request, Response } from 'express';
import {
  Store,
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
} from '../models/index';

// 가게 추가
export const createStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newStore: Store = req.body;
    const storeId = await createStore(newStore, req.file?.path);
    res.status(201).json({ storeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

// 가게 전체 조회
export const getAllStoresHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stores = await getAllStores();
    res.status(200).json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

// 특정 가게 조회
export const getStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const store = await getStoreById(storeId);
    if (store) {
      res.status(200).json(store);
    } else {
      res.status(404).json({ error: 'Store not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
};

// 가게 정보 수정
export const updateStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const updatedStore: Store = req.body;
    await updateStore(storeId, updatedStore, req.file?.path);
    res.status(200).json({ message: 'Store updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update store' });
  }
};

// // 가게 삭제
// export const deleteStoreHandler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const storeId = parseInt(req.params.storeId, 10);
//     await deleteStore(storeId);
//     res.status(200).json({ message: 'Store deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to delete store' });
//   }
// };
