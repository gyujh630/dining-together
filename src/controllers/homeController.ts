import { Request, Response } from 'express';
import { getHomeWhenLogin, getHomeWhenNotLogin, getUserById } from '../models';

// 가게 전체 조회
export const getHomeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, userType } = req.query;
    // const parseUserId = parseInt(userId, 10)

    // userType과 userId가 정의되지 않은 경우 (로그인x)
    if (userType === undefined && userId === undefined) {
      const a = await getHomeWhenNotLogin(); // 비로그인 시 화면 조회
      res.status(200).json(a);
    } else if (typeof userId === 'string') {
      const user = await getUserById(parseInt(userId, 10));
      if (!user) {
        res.status(404).send(`User not found`);
      } else {
        //user가 유효함
        if (userType === '2') {
          const a = await getHomeWhenNotLogin();
          res.status(200).json(a);
        } else if (userType === '1') {
          const a = await getHomeWhenLogin(
            parseInt(userId, 10),
            parseInt(userType, 10)
          );
          res.status(200).json(a);
        } else {
          res.status(400).json({ error: '유효하지 않은 userType 값입니다.' });
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};
