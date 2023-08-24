import { Request, Response } from 'express';
import { getImagesByStoreId } from '../models/StoreImageModel';

// 특정 가게의 이미지 목록 조회
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
