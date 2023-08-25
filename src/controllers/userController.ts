import { Request, Response } from 'express';
import { generateAuthToken, revokeToken } from '../utils/jwt-util';
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
    const isEmailDuplicate = await checkEmail(newUser.email);
    if (isEmailDuplicate) {
      res.status(409).json({ message: '중복된 이메일입니다.' });
    } else {
      const createdUserId = await createUser(newUser);
      res.status(201).json({ createdUserId });
    }
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
        .json({ isDuplicated: true, message: '중복된 이메일입니다.' });
    } else {
      res
        .status(200)
        .json({ isDuplicated: false, message: '사용 가능한 이메일입니다.' });
    }
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

// 로그인
export async function logInHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body; //로그인 시 입력된 정보
    // 사용자 확인 로직
    const user = await authenticateUser(email, password);
    if (user && !user.isDeleted) {
      //해당 계정이 존재하고, 삭제계정이 아닌 경우 token 발급
      const token = generateAuthToken(user);
      res.status(200).json({ token }); // 토큰을 응답으로
    } else {
      res.status(401).json({ message: 'No Matching User' }); //일치하는 사용자 정보 없음
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
    if (!user || !user.isDeleted) {
      res.status(404).send('User not found');
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
    if (!user || !user.isDeleted) {
      res.status(404).send('User not found');
      return;
    } else {
      await updateUserById(userId, updatedUser);
      res.send('User updated successfully');
    }
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

/*
// 회원 삭제
export async function deleteUserHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId: number = parseInt(req.params.userId, 10);
    await deleteUserById(userId);
    res.send('User deleted successfully');
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}
*/
