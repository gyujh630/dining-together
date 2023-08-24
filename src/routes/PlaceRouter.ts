import express from 'express';
import multer from 'multer';
import {
  createPlaceHandler,
  getAllPlacesHandler,
  getPlaceHandler,
  updatePlaceHandler,
  // deletePlaceHandler,
} from '../controllers/PlaceController';

const placeRouter = express.Router();
const upload = multer();

placeRouter.post('/', upload.single('placeImage'), createPlaceHandler);
placeRouter.get('/:storeId', getAllPlacesHandler);
placeRouter.get('/:storeId/:placeId', getPlaceHandler);
placeRouter.put('/:storeId/:placeId', updatePlaceHandler);
// placeRouter.delete('/:placeId', deletePlaceHandler);

export { placeRouter };
