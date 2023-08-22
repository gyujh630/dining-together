import pool from '../config/dbConfig';

export interface User {
  userId: number;
  externalId: string;
  email: string;
  password: string;
  name: string;
  phoneNum: string;
  userType: number; // 0 -> 관리자. 1 -> 일반. 2 -> 사장님
  createdAt?: Date;
  modifiedAt?: Date;
  isDeleted: boolean;
}

// 회원 생성
export async function createUser(user: User): Promise<number> {
  const createUserQuery = `
    INSERT INTO USER (email, password, name, phoneNum, userType)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.query(createUserQuery, [
      user.email,
      user.password,
      user.name,
      user.phoneNum,
      user.userType,
    ]);

    return (result as any).insertId as number;
  } catch (error) {
    console.log(error);
    throw new Error('Error creating user');
  }
}

// 회원 조회
export async function getUserById(userId: number): Promise<User | null> {
  const getUserQuery = `
    SELECT * FROM USER WHERE userId = ?
  `;

  try {
    const [rows]: any[] = await pool.query(getUserQuery, [userId]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as User;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting user by ID');
  }
}

// 회원 전체조회
export async function getAllUser(): Promise<User[]> {
  const getAllUserQuery = `
    SELECT * FROM USER;
  `;

  try {
    const [rows] = await pool.query(getAllUserQuery);
    return rows as User[];
  } catch (error) {
    console.log(error);
    throw new Error('Error getting all users list');
  }
}

// 회원 수정
export async function updateUserById(
  userId: number,
  updatedUser: User
): Promise<void> {
  const updateUserQuery = `
    UPDATE USER
    SET email = ?, password = ?, name = ?, phoneNum = ?, userType = ?, isDeleted = ?
    WHERE userId = ?
  `;

  try {
    await pool.query(updateUserQuery, [
      updatedUser.email,
      updatedUser.password,
      updatedUser.name,
      updatedUser.phoneNum,
      updatedUser.userType,
      updatedUser.isDeleted,
      userId,
    ]);
  } catch (error) {
    console.log(error);
    throw new Error('Error updating user');
  }
}

// 회원 삭제
export async function deleteUserById(userId: number): Promise<void> {
  const deleteUserQuery = `
    DELETE FROM USER WHERE userId = ?
  `;

  try {
    await pool.query(deleteUserQuery, [userId]);
  } catch (error) {
    console.log(error);
    throw new Error('Error deleting user');
  }
}
