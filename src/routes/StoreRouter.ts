import express from 'express';
import {
  createStoreHandler,
  getAllStoresHandler,
  getStoreHandler,
  updateStoreHandler,
  softDeleteStoreHandler,
  deleteStoreHandler,
} from '../controllers/StoreController';

const storeRouter = express.Router();

// 가게 추가
storeRouter.post('/', createStoreHandler);

// 가게 전체 조회
storeRouter.get('/', getAllStoresHandler);

// 특정 가게 조회
storeRouter.get('/:storeId', getStoreHandler);

// 가게 정보 수정
storeRouter.put('/:storeId', updateStoreHandler);

// 가게 삭제(소프트)
storeRouter.put('/:storeId', softDeleteStoreHandler);

// 가게 삭제(하드)
storeRouter.delete('/:storeId', deleteStoreHandler);

export { storeRouter };
