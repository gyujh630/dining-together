import express from 'express';
import {
  createStoreHandler,
  getAllStoresHandler,
  getMyStoreHandler,
  getStoreHandler,
  updateStoreHandler,
} from '../controllers/StoreController';
import {
  createPlaceHandler,
  getAllPlacesHandler,
  getPlaceHandler,
  updatePlaceHandler,
} from '../controllers/PlaceController';
import {
  getAllImagesHandler,
  getImageHandler,
} from '../controllers/StoreImageController';
import {
  searchStoresHandler,
  filterStoresHandler,
} from '../controllers/SearchFilterController';
import { upload } from '../config/uploadConfig';
import { getReservationsByStoreIdHandler } from '../controllers/ReservationController';
import { verifyToken } from '../utils/jwt-util';

const storeRouter = express.Router();

// SEARCH & FILTER
storeRouter.get('/search', searchStoresHandler);
storeRouter.get('/filter', filterStoresHandler);

// STORE
storeRouter.post(
  '/',
  upload.array('storeImage', 5),
  verifyToken,
  createStoreHandler
);
storeRouter.get('/', getAllStoresHandler);
storeRouter.get('/my', verifyToken, getMyStoreHandler);
storeRouter.get('/:storeId', getStoreHandler);
storeRouter.put(
  '/:storeId',
  verifyToken,
  upload.single('storeImage'),
  updateStoreHandler
);
storeRouter.get(
  '/:storeId/reserve',
  verifyToken,
  getReservationsByStoreIdHandler
);

// PLACE
storeRouter.post(
  '/places',
  verifyToken,
  upload.single('placeImage'),
  createPlaceHandler
);
storeRouter.get('/:storeId/places', getAllPlacesHandler);
storeRouter.get('/places/:placeId', getPlaceHandler);
storeRouter.put(
  '/places/:placeId',
  verifyToken,
  upload.single('placeImage'),
  updatePlaceHandler
);

// STOREIMAGE
storeRouter.get('/:storeId/images', getAllImagesHandler);
storeRouter.get('/images/:imageId', getImageHandler);

export { storeRouter };
