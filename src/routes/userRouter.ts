import express from 'express';

import {
  createUserHandler,
  getAllUserHandler,
  getUserHandler,
  updateUserHandler,
  // deleteUserHandler,
  logInHandler,
  logOutHandler,
  checkEmailHandler,
} from '../controllers/userController';
import { getReservationsByUserIdHandler } from '../controllers/ReservationController';

const userRouter = express.Router();

userRouter.get('/', getAllUserHandler);
userRouter.post('/signup', createUserHandler);
userRouter.get('/check', checkEmailHandler);
userRouter.post('/login', logInHandler);
userRouter.get('/logout', logOutHandler);
userRouter.get('/:userId', getUserHandler);
userRouter.put('/:userId', updateUserHandler);
userRouter.get('/:userId/reserve', getReservationsByUserIdHandler);
// userRouter.delete('/:userId', deleteUserHandler);

export { userRouter };
