import express from 'express';

import {
  createUserHandler,
  getAllUserHandler,
  getUserHandler,
  updateUserHandler,
  // deleteUserHandler,
  logInHandler,
  logOutHandler,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', getAllUserHandler);
userRouter.post('/signup', createUserHandler);
userRouter.post('/login', logInHandler);
userRouter.get('/logout', logOutHandler);
userRouter.get('/:userId', getUserHandler);
userRouter.put('/:userId', updateUserHandler);
// userRouter.delete('/:userId', deleteUserHandler);

export { userRouter };
