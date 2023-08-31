import { Request, Response } from 'express';
import { generateAuthToken, revokeToken } from '../utils/jwt-util';
import {
  isEmailValid,
  isPasswordValid,
  validatePhoneNumber,
} from '../utils/string-util';
import { User } from '../models/userModel';
import {
  createUser,
  getUserById,
  getAllUser,
  updateUserById,
  // deleteUserById,
  authenticateUser,
  checkEmail,
} from '../models/userModel';

// 회원가입
export async function createUserHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const newUser: User = req.body;
    if (!isEmailValid(newUser.email)) {
      res.status(400).json({ error: '유효하지 않은 이메일 형식입니다.' });
      return;
    }
    if (!isPasswordValid(newUser.password)) {
      res.status(400).json({ error: '유효하지 않은 비밀번호 형식입니다.' });
      return;
    }
    if (!validatePhoneNumber(newUser.phoneNum)) {
      res.status(400).json({ error: '유효하지 않은 연락처 형식입니다.' });
      return;
    }

    //생성
    const createdUserId = await createUser(newUser);
    res.status(201).json({ createdUserId });
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

// 이메일 중복 검사
export async function checkEmailHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.query;
    const isEmailDuplicate = await checkEmail(email as string);

    if (isEmailDuplicate) {
      res
        .status(200)
        .json({ isDuplicated: true, error: '중복된 이메일입니다.' });
    } else {
      res
        .status(200)
        .json({ isDuplicated: false, message: '사용 가능한 이메일입니다.' });
    }
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
}

// 로그인
export async function logInHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body; //로그인 시 입력된 정보
    // 사용자 확인 로직
    const user = await authenticateUser(email, password);
    if (user && !user.isDeleted) {
      const token = generateAuthToken(user);
      const userType = user.userType;
      const userId = user.userId;
      res.status(200).json({ token, userId, userType });
    } else {
      res.status(401).json({ error: 'No Matching User' }); //일치하는 사용자 정보 없음
    }
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

export async function logOutHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    revokeToken(req.headers.authorization as string); //토큰 무효화
    res.status(200).json({ message: 'Logout Success' });
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

// 회원 조회
export async function getUserHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId: number = parseInt(req.params.userId, 10);
    const user = await getUserById(userId);
    if (!user || user.isDeleted) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

// 모든 회원 조회
export async function getAllUserHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const users = await getAllUser();
    res.json(users);
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

// 회원 수정
export async function updateUserHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId: number = parseInt(req.params.userId, 10);
    const user = await getUserById(userId);
    const updatedUser: User = req.body;

    await updateUserById(userId, updatedUser);
    res.json({ message: 'User updated successfully' });
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}
