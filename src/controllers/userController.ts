import { Connection } from 'mysql2/promise';
import { User } from '../models/userModel';

export async function createUser(connection: Connection, user: User) {
  try {
    const createUserQuery = `
            INSERT INTO USER (email, password, name, phoneNum, userType)
            VALUES (?, ?, ?, ?, ?)
        `;

    await connection.query(createUserQuery, [
      user.email,
      user.password,
      user.name,
      user.phoneNum,
      user.userType,
    ]);
  } catch (error) {
    throw new Error(`Error inserting user: ${error}`);
  }
}
