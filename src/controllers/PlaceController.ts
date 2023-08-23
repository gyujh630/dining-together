import { Request, Response } from 'express';
import {
  Place,
  createPlace,
  getPlaceByStoreId,
  getPlaceByStorePlaceId,
  updatePlace,
} from '../models/PlaceModel';

// 특정 가게의 공간 추가
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
    res.status(500).json({ error: 'Failed to create place' });
  }
};

// 특정 가게의 공간 전체 조회
export const getAllPlacesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const place = await getPlaceByStoreId(storeId);
    if (place) {
      res.status(200).json(place);
    } else {
      res.status(404).json({ error: 'Place not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch place' });
  }
};

// 특정 가게의 특정 공간 조회
export const getPlaceHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const placeId = parseInt(req.params.placeId, 10);
    const place = await getPlaceByStorePlaceId(storeId, placeId);
    if (place) {
      res.status(200).json(place);
    } else {
      res.status(404).json({ error: 'Place not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch place' });
  }
};

// 특정 가게의 특정 공간 정보 수정 & 소프트 삭제
export const updatePlaceHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const placeId = parseInt(req.params.placeId, 10);
    const updatedPlace: Place = req.body;
    await updatePlace(storeId, placeId, updatedPlace);

    res.status(200).json({ message: 'Place updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update place' });
  }
};
