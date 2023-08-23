import { Request, Response } from 'express';
import {
  StoreImage,
  addImageToStore,
  getImagesByStoreId,
  deleteImage,
} from '../models/StoreImageModel';

// 이미지 추가
export const addImageToStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const imageUrl = req.body.imageUrl;
    const imageId = await addImageToStore(storeId, imageUrl);
    res.status(201).json({ imageId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add image to store' });
  }
};

// 특정 가게의 이미지 목록 조회
export const getImagesByStoreIdHandler = async (
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

// 특정 이미지 삭제
export const deleteImageHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const imageId = parseInt(req.params.imageId, 10);
    await deleteImage(imageId);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
