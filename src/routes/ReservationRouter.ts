import express from 'express';
import {
  createReservationHandler,
  getAllReservationsHandler,
  updateReservationHandler,
  getReservationByIdHandler,
  getAvailablePlacesHandler,
} from '../controllers/ReservationController';
import { verifyToken } from '../utils/jwt-util';

const reservationRouter = express.Router();

reservationRouter.post('/', verifyToken, createReservationHandler);
reservationRouter.get('/', verifyToken, getAllReservationsHandler);
reservationRouter.get('/placelist', verifyToken, getAvailablePlacesHandler);
reservationRouter.get('/:reservedId', verifyToken, getReservationByIdHandler);
reservationRouter.put('/:reservedId', verifyToken, updateReservationHandler);

export { reservationRouter };
