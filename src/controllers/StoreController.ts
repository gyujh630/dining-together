import { Request, Response } from 'express';
import {
  Store,
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  getStoreByUserId,
} from '../models/index';

// 가게 추가
export const createStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newStore: Store = req.body;

    if (req.files && Array.isArray(req.files)) {
      const storeImages: Express.Multer.File[] = req.files;

      const storeId = await createStore(newStore, storeImages);

      res.status(201).json({ storeId });
    }
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

// 내 가게 조회
export const getMyStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.decoded.userId; //토큰에서 가져온 아이디
    const store = await getStoreByUserId(userId);
    res.status(200).json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get my store' });
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
    const { updatedStore, storeImage } = req.body;
    const imagePath = req.file?.filename;

    if (typeof updatedStore.address === 'string') {
      updatedStore.address = JSON.parse(updatedStore.address);
    }
    if (typeof updatedStore.operatingHours === 'string') {
      updatedStore.operatingHours = JSON.parse(updatedStore.operatingHours);
    }

    await updateStore(storeId, updatedStore, imagePath, storeImage);
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
