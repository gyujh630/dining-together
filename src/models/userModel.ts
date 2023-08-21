export interface User {
  userId: number;
  email: string;
  password: string;
  name: string;
  phoneNum: string;
  userType: number;
  createAt: Date;
  modifiedAt: Date;
  isDeleted: boolean;
}
