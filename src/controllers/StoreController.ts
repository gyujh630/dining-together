import { Request, Response } from 'express';
import { Store, createStore, getStoreById } from '../models/StoreModel';

export const createNewStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newStore: Store = req.body;
    const storeId = await createStore(newStore);
    res.status(201).json({ storeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

// GET /stores/:storeId
export const getStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const store = await getStoreById(storeId);
    if (store) {
      res.status(200).json(store);
    } else {
      res.status(404).json({ error: 'Store not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
};
