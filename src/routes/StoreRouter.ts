import express from 'express';
import {
  createStoreHandler,
  getAllStoresHandler,
  getStoreHandler,
  updateStoreHandler,
  // deleteStoreHandler,
  //  createStoreWithImageHandler,
} from '../controllers/StoreController';
import { upload } from '../config/uploadConfig';

const storeRouter = express.Router();

storeRouter.post('/', createStoreHandler);
storeRouter.get('/', getAllStoresHandler);
storeRouter.get('/:storeId', getStoreHandler);
storeRouter.put('/:storeId', updateStoreHandler);
// storeRouter.delete('/:storeId', deleteStoreHandler);

// // 가게 추가(STOREIMAGE 조인) x
// storeRouter.post(
//   '/storeJoinImage',
//   upload.array('images'),
//   createStoreWithImageHandler
// );

export { storeRouter };
