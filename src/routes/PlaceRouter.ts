import express from 'express';
import {
  createPlaceHandler,
  getAllPlacesHandler,
} from '../controllers/PlaceController';

const placeRouter = express.Router();

placeRouter.post('/:storeId', createPlaceHandler);
placeRouter.get('/:storeId', getAllPlacesHandler);
//placeRouter.get('/:placeId', getPlaceHandler);
//placeRouter.put('/:placeId', updatePlaceHandler);
//placeRouter.delete('/:placeId', deletePlaceHandler);

export { placeRouter };
