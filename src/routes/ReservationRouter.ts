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
reservationRouter.get('/:reservedId', getReservationByIdHandler);
reservationRouter.put('/:reservedId', updateReservationHandler);
reservationRouter.get('/placelist', getAvailablePlacesHandler);

export { reservationRouter };
