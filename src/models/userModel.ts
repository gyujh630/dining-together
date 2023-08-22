export interface User {
  userId: number;
  externalId: string;
  email: string;
  password: string;
  name: string;
  phoneNum: string;
  userType: number; //0 -> 관리자. 1 -> 일반. 2-> 사장님
  createdAt: Date;
  modifiedAt: Date;
  isDeleted: boolean;
}
