import { Request, Response } from 'express';
import { User } from '../models/userModel';
import {
  createUser,
  getUserById,
  getAllUser,
  updateUserById,
  deleteUserById,
} from '../models/userModel';

// 회원 생성
export async function createUserHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const newUser: User = req.body;
    const createdUserId = await createUser(newUser);
    res.status(201).json({ createdUserId });
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
    const updatedUser: User = req.body;
    await updateUserById(userId, updatedUser);
    res.send('User updated successfully');
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

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
