import { Request, Response } from 'express';
import * as StoreService from '../services/StoreService';

// 가게 생성
export const createStore = async (req: Request, res: Response) => {
  try {
    const storeData = req.body;
    const storeId = await StoreService.createNewStore(storeData);
    res.status(201).json({ storeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create store' });
  }
};

// 가게 조회
export const getStore = async (req: Request, res: Response) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const store = await StoreService.fetchStoreById(storeId);
    if (store) {
      res.status(200).json(store);
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch store' });
  }
};
