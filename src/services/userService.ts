import { Connection } from 'mysql2/promise';
import { User } from '../models/userModel';

export async function createUser(connection: Connection, user: User) {
  try {
    const createUserQuery = `
      INSERT INTO USER (email, password, name, phoneNum, userType)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(createUserQuery, [
      user.email,
      user.password,
      user.name,
      user.phoneNum,
      user.userType,
    ]);

    return { userId: result.insertId, ...user };
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

// 회원 조회
export async function getUserById(connection: Connection, userId: number) {
  const getUserQuery = `
    SELECT * FROM USER WHERE userId = ?
  `;

  const [rows]: any = await connection.query(getUserQuery, [userId]);
  return rows[0];
}

// 회원 수정
export async function updateUserById(
  connection: Connection,
  userId: number,
  updatedUser: User
) {
  const updateUserQuery = `
    UPDATE USER
    SET email = ?, password = ?, name = ?, phoneNum = ?, userType = ?, isDeleted =?,
    WHERE userId = ?
  `;

  await connection.query(updateUserQuery, [
    updatedUser.email,
    updatedUser.password,
    updatedUser.name,
    updatedUser.phoneNum,
    updatedUser.userType,
    userId,
  ]);
}

// 회원 삭제
export async function deleteUserById(connection: Connection, userId: number) {
  const deleteUserQuery = `
    DELETE FROM USER WHERE userId = ?
  `;

  await connection.query(deleteUserQuery, [userId]);
}
