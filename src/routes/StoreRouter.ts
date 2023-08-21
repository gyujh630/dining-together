import express from 'express';
import { createStore, getStore } from '../controllers/StoreController';

const storeRouter = express.Router();

storeRouter.post('/', createStore);
storeRouter.get('/', getStore);

export default storeRouter;
