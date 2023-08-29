import express from 'express';

import {
  createUserHandler,
  getAllUserHandler,
  getUserHandler,
  updateUserHandler,
  logInHandler,
  logOutHandler,
  checkEmailHandler,
} from '../controllers/userController';
import { verifyToken } from '../utils/jwt-util';
import { getReservationsByUserIdHandler } from '../controllers/ReservationController';

const userRouter = express.Router();

userRouter.get('/', verifyToken, getAllUserHandler);
userRouter.post('/signup', createUserHandler);
userRouter.get('/check', checkEmailHandler);
userRouter.post('/login', logInHandler);
userRouter.get('/logout', verifyToken, logOutHandler);
userRouter.get('/:userId', verifyToken, getUserHandler);
userRouter.put('/:userId', verifyToken, updateUserHandler);
userRouter.get('/:userId/reserve', verifyToken, getReservationsByUserIdHandler);

export { userRouter };
