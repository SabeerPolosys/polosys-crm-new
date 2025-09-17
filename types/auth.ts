// types/auth.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
}
