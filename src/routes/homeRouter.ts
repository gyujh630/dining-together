import express from 'express';
import { getAllStoresAtHome } from '../controllers/homeController';

const homeRouter = express.Router();

homeRouter.get('/', getAllStoresAtHome);

export { homeRouter };
