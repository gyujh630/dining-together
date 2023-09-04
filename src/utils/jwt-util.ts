import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

interface DecodedToken {
  userId: number;
  userType: number;
}

declare global {
  namespace Express {
    interface Request {
      decoded: DecodedToken;
    }
  }
}

export const generateAuthToken = (user: DecodedToken): string => {
  const { userId, userType } = user;
  const token = jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET as Secret,
    { expiresIn: '12h' } // 토큰 만료 시간
  );
  return token;
};

export const decodeToken = (token: string) => {
  const tokenString = token.split(' ');
  const decodedToken = jwt.decode(tokenString[1]);
  return decodedToken as DecodedToken;
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenString = (req.headers.authorization as string).split(' ');

    const decoded = jwt.verify(
      tokenString[1],
      process.env.JWT_SECRET as Secret
    );

    req.decoded = decoded as DecodedToken;
    return next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '권한 만료',
      });
    }
    return res.status(401).json({
      code: 401,
      message: '권한이 없습니다.',
    });
  }
};
