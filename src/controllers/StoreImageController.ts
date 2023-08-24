import { Request, Response } from 'express';
import {
  StoreImage,
  createStoreImage,
  getImagesByStoreId,
  deleteImage,
} from '../models/StoreImageModel';

// 이미지 추가
export const createImageAndStoreAssociation = async (
  storeId: number,
  imageUrl: string
): Promise<void> => {
  try {
    const image: StoreImage = {
      imageUrl,
      storeId,
    };

    await createStoreImage(image);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to associate image with store');
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
