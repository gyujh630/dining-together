import { Request, Response } from 'express';
import {
  getImagesByStoreId,
  getImageByImageId,
} from '../models/StoreImageModel';

// 특정 가게의 모든 이미지 조회
export const getAllImagesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const images = await getImagesByStoreId(storeId);
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch store images' });
  }
};

// 특정 가게의 특정 이미지 조회
export const getImageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const imageId = parseInt(req.params.imageId, 10);
    const image = await getImageByImageId(imageId);
    res.status(200).json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch store images' });
  }
};
