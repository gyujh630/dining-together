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
} from '../models/userModel';

// 회원가입
export async function createUserHandler(
  req: Request,
  res: Response
): Promise<void> {
  console.log(req.body);
  try {
    const newUser: User = req.body;
    const createdUserId = await createUser(newUser);
    res.status(201).json({ createdUserId }); //+ token
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
    res.status(200).json({ message: '로그아웃이 완료되었습니다.' });
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
    if (!user) {
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
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    await updateUserById(userId, updatedUser);
    res.send('User updated successfully');
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
