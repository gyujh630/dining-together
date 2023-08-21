import express from 'express';
import { createNewStore, getStore } from '../controllers/StoreController';

const storeRouter = express.Router();

storeRouter.post('/', createNewStore);
storeRouter.get('/', getStore);

export default storeRouter;
