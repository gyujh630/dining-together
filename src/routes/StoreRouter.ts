import express from 'express';
import {
  createStoreHandler,
  getAllStoresHandler,
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
import { upload } from '../config/uploadConfig';
import { getReservationsByStoreIdHandler } from '../controllers/ReservationController';
const storeRouter = express.Router();

// STORE
storeRouter.post('/', upload.array('storeImage', 3), createStoreHandler);
storeRouter.get('/', getAllStoresHandler);
storeRouter.get('/:storeId', getStoreHandler);
storeRouter.put('/:storeId', upload.single('storeImage'), updateStoreHandler);
storeRouter.get('/:storeId/reserve', getReservationsByStoreIdHandler);

// PLACE
storeRouter.post('/places', upload.single('placeImage'), createPlaceHandler);
storeRouter.get('/:storeId/places', getAllPlacesHandler);
storeRouter.get('/places/:placeId', getPlaceHandler);
storeRouter.put(
  '/places/:placeId',
  upload.single('placeImage'),
  updatePlaceHandler
);

// STOREIMAGE
storeRouter.get('/:storeId/images', getAllImagesHandler);
storeRouter.get('/images/:imageId', getImageHandler);

export { storeRouter };
