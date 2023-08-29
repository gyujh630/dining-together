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

// 무효화된 토큰 목록
const revokedTokens = new Set<string>();

// 토큰을 무효화하는 함수
export const revokeToken = (token: string) => {
  revokedTokens.add(token);
};

export const generateAuthToken = (user: DecodedToken): string => {
  const token = jwt.sign(
    user,
    process.env.JWT_SECRET as Secret,
    { expiresIn: '12h' } // 토큰 만료 시간
  );
  return token;
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

    // 로그아웃된 경우
    if (revokedTokens.has(req.headers.authorization as string)) {
      return res.status(419).json({
        code: 401,
        message: '권한 만료',
      });
    }

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
