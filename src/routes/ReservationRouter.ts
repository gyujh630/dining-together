import express from 'express';
import {
  createReservationHandler,
  getAllReservationsHandler,
  getReservationsByStoreIdHandler,
  getReservationsByUserIdHandler,
  updateReservationHandler,
  getReservationByIdHandler,
} from '../controllers/ReservationController';

const reservationRouter = express.Router();

reservationRouter.post('/', createReservationHandler);
reservationRouter.get('/', getAllReservationsHandler);
reservationRouter.get('/:reservedId', getReservationByIdHandler);
reservationRouter.put('/:reservedId', updateReservationHandler);
reservationRouter.get('/user/:userId', getReservationsByUserIdHandler);
reservationRouter.get('/store/:storeId', getReservationsByStoreIdHandler);

export { reservationRouter };
