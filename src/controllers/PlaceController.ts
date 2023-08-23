import { Request, Response } from 'express';
import { Place, createPlace, getPlaceById } from '../models/PlaceModel';

export const createPlaceHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newPlace: Place = req.body;
    const placeId = await createPlace(newPlace);
    res.status(201).json({ placeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

export const getAllPlacesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const place = await getPlaceById(storeId);
    if (place) {
      res.status(200).json(place);
    } else {
      res.status(404).json({ error: 'Store not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
};
