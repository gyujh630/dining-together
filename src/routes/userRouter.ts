import express from 'express';

import {
  createUserHandler,
  getAllUserHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/signup', createUserHandler);
userRouter.get('/', getAllUserHandler);
userRouter.get('/:userId', getUserHandler);
userRouter.put('/:userId', updateUserHandler);
userRouter.delete('/:userId', deleteUserHandler);

export { userRouter };
