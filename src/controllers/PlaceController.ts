import { Request, Response } from 'express';
import path from 'path';
import {
  Place,
  createPlace,
  getPlacesByStoreId,
  getPlaceByPlaceId,
  updatePlace,
} from '../models/PlaceModel';
import { upload } from '../config/uploadConfig';
import { updateIsRoomTrue } from '../models/StoreModel';

export const createPlaceHandler = (req: Request, res: Response): void => {
  try {
    const newPlace: Place = req.body;

    // 이미지 업로드 처리
    upload.single('placeImage')(req, res, async (err: any) => {
      // if (err) {
      //   console.error(err);
      //   return res.status(500).json({ error: 'Failed to upload image' });
      // }

      if (req.file) {
        // 이미지 업로드 성공한 경우
        newPlace.placeImage = path.join(
          'uploads',
          'places',
          req.file.originalname
        ); // 이미지 파일 경로 저장
      }

      const placeId = await createPlace(newPlace);

      if (newPlace.placeType === '룸') {
        await updateIsRoomTrue(newPlace.storeId);
      }

      res.status(201).json({ placeId });
    });
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
    const place = await getPlacesByStoreId(storeId);
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
    const placeId = parseInt(req.params.placeId, 10);
    const place = await getPlaceByPlaceId(placeId);
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
    const placeId = parseInt(req.params.placeId, 10);
    const updatedPlace: Place = req.body;
    // 새로운 이미지 업로드 처리
    upload.single('newPlaceImage')(req, res, async (err: any) => {
      // if (err) {
      //   console.error(err);
      //   return res.status(500).json({ error: 'Failed to upload image' });
      // }

      if (req.file) {
        // 이미지 업로드 성공한 경우
        updatedPlace.placeImage = path.join(
          'uploads',
          'places',
          req.file.originalname
        ); // 이미지 파일 경로 저장
      }

      await updatePlace(placeId, updatedPlace);

      res.status(200).json({ message: 'Place updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update place' });
  }
};
