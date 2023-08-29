import { Request, Response } from 'express';
import { getHomeWhenLogin, getHomeWhenNotLogin } from '../models';
import { decodeToken } from '../utils/jwt-util';

// 가게 전체 조회
export const getHomeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 요청 헤더에서 토큰을 가져오기
    const token = req.headers.authorization;
    if (token) {
      const authToken = decodeToken(token);
      const userId = authToken.userId;
      const userType = authToken.userType;

      if (userType === 2) {
        const data = await getHomeWhenNotLogin();
        res.status(200).json(data);
      } else if (userType === 1) {
        const data = await getHomeWhenLogin(userId, userType);
        res.status(200).json(data);
      } else {
        res.status(400).json({ error: '유효하지 않은 userType 값입니다.' });
      }
    } else {
      // 토큰이 없는 경우 (비로그인 상태)
      const data = await getHomeWhenNotLogin();
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};
