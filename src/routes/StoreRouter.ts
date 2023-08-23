import express from 'express';
import {
  createStoreHandler,
  getAllStoresHandler,
  getStoreHandler,
  updateStoreHandler,
  deleteStoreHandler,
} from '../controllers/StoreController';

const storeRouter = express.Router();

storeRouter.post('/', createStoreHandler);
storeRouter.get('/', getAllStoresHandler);
storeRouter.get('/:storeId', getStoreHandler);
storeRouter.put('/:storeId', updateStoreHandler);
storeRouter.delete('/:storeId', deleteStoreHandler);

export { storeRouter };
