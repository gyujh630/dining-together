import { Request, Response } from 'express';
import { getAllStoresNotDel } from '../models/index';

// 가게 전체 조회
export const getHomeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userType = req.query.userType;
    console.log(userType);
    if (userType === undefined || userType === '2') {
      console.log('비회원, 사장님 회원');
    } else if (userType === '1') {
      console.log('일반회원');
    } else {
      res.status(400).json({ error: '잘못된 userType 값' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};
