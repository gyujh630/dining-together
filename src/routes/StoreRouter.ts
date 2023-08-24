import express from 'express';
import {
  createStoreHandler,
  getAllStoresHandler,
  getStoreHandler,
  updateStoreHandler,
  // deleteStoreHandler,
} from '../controllers/StoreController';
import {
  createPlaceHandler,
  getAllPlacesHandler,
  getPlaceHandler,
  updatePlaceHandler,
  // deletePlaceHandler,
} from '../controllers/PlaceController';
import { upload } from '../config/uploadConfig';

const storeRouter = express.Router();

// STORE
storeRouter.post('/', upload.single('storeImage'), createStoreHandler);
storeRouter.get('/', getAllStoresHandler);
storeRouter.get('/:storeId', getStoreHandler);
storeRouter.put('/:storeId', upload.single('storeImage'), updateStoreHandler);

// PLACE
storeRouter.post('/places', upload.single('placeImage'), createPlaceHandler);
storeRouter.get('/:storeId/places', getAllPlacesHandler);
storeRouter.get('/places/:placeId', getPlaceHandler);
storeRouter.put(
  '/places/:placeId',
  upload.single('placeImage'),
  updatePlaceHandler
);
// storeRouter.delete('/:storeId', deleteStoreHandler);

export { storeRouter };
