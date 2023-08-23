import express from 'express';
import {
  createPlaceHandler,
  getAllPlacesHandler,
  getPlaceHandler,
  updatePlaceHandler,
  // deletePlaceHandler,
} from '../controllers/PlaceController';

const placeRouter = express.Router();

placeRouter.post('/', createPlaceHandler);
placeRouter.get('/:storeId', getAllPlacesHandler);
placeRouter.get('/:storeId/:placeId', getPlaceHandler);
placeRouter.put('/:storeId/:placeId', updatePlaceHandler);
// placeRouter.delete('/:placeId', deletePlaceHandler);

export { placeRouter };
