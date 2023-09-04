import express from 'express';
import { getHomeController } from '../controllers/homeController';

const homeRouter = express.Router();

homeRouter.get('/', getHomeController);

export { homeRouter };
