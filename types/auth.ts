// types/auth.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
}

export interface ResetRequest {
  confirmPassword: string;
  password: string;
}

export interface RoleType {
  userTypeId: string,
  typeName: string,
  description: string,
  createdAt: Date,
  modifiedAt: Date
}

export interface UserType {
  userId: string,
  userName: string,
  email: string,
  userTypeId: string,
  typeName?: string,
  clientID: string,
  organizationName?: string,
  isActive: boolean,
  createdAt: Date,
  modifiedAt: Date
}