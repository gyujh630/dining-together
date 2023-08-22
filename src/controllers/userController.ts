import { Request, Response } from 'express';
import { Connection } from 'mysql2/promise';
import { User } from '../models/userModel';
import * as userService from '../services/userService';

// 회원 생성
export async function createUser(
  req: Request,
  res: Response,
  connection: Connection
) {
  try {
    const user: User = req.body;
    const createdUser = await userService.createUser(connection, user);
    res.status(201).json(createdUser);
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

// 회원 조회
export async function getUserById(
  req: Request,
  res: Response,
  connection: Connection
) {
  try {
    const userId: number = parseInt(req.params.userId, 10);
    const user = await userService.getUserById(connection, userId);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.json(user);
    }
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

// 회원 수정
export async function updateUserById(
  req: Request,
  res: Response,
  connection: Connection
) {
  try {
    const userId: number = parseInt(req.params.userId, 10);
    const updatedUser: User = req.body;
    await userService.updateUserById(connection, userId, updatedUser);
    res.send('User updated successfully');
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}

// 회원 삭제
export async function deleteUserById(
  req: Request,
  res: Response,
  connection: Connection
) {
  try {
    const userId: number = parseInt(req.params.userId, 10);
    await userService.deleteUserById(connection, userId);
    res.send('User deleted successfully');
  } catch (error: any) {
    res.status(500).send(`Error: ${error.message}`);
  }
}
