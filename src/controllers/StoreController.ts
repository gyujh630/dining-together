import { Request, Response } from 'express';
import {
  Store,
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  softDeleteStore,
  deleteStore,
  StoreImage,
  addImageToStore,
  getImagesByStoreId,
} from '../models/index';

// 가게 추가
export const createStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newStore: Store = req.body;
    const storeId = await createStore(newStore, req);
    res.status(201).json({ storeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

// 가게 추가(STOREIMAGE 조인) x
/*
export const createStoreWithImageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newStore: Store = req.body;
    const files = req.files as Express.Multer.File[];

    const storeId = await createStore(newStore, req);

    const imagePromises = files.map(async (file) => {
      const imageUrl = `/uploads/${file.filename}`;
      const imageId = await addImageToStore(storeId, imageUrl);
      return imageId;
    });

    await Promise.all(imagePromises);

    res.status(201).json({ storeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create store with image' });
  }
};
*/

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
      const images = await getImagesByStoreId(storeId);
      store.storeImage = images;
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
    await updateStore(storeId, updatedStore);
    res.status(200).json({ message: 'Store updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update store' });
  }
};

// 가게 삭제(소프트)
export const softDeleteStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    await softDeleteStore(storeId);
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete store' });
  }
};

// 가게 삭제(하드)
export const deleteStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    await deleteStore(storeId);
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete store' });
  }
};
