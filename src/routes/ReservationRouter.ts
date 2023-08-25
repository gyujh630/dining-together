import express from 'express';
import {
  createReservationHandler,
  getAllReservationsHandler,
  updateReservationHandler,
  getReservationByIdHandler,
  getAvailablePlacesHandler,
} from '../controllers/ReservationController';

const reservationRouter = express.Router();

reservationRouter.post('/', createReservationHandler);
reservationRouter.get('/', getAllReservationsHandler);
reservationRouter.get('/placelist', getAvailablePlacesHandler);
reservationRouter.get('/:reservedId', getReservationByIdHandler);
reservationRouter.put('/:reservedId', updateReservationHandler);

export { reservationRouter };
