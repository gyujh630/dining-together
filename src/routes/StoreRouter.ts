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

storeRouter.post('/', upload.single('storeImage'), createStoreHandler);
storeRouter.get('/', getAllStoresHandler);
storeRouter.get('/:storeId', getStoreHandler);
storeRouter.put('/:storeId', updateStoreHandler);
// storeRouter.delete('/:storeId', deleteStoreHandler);

export { storeRouter };
