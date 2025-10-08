// types/auth.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
  usertypeid?:string;
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

export interface PermissionModuleType {
  moduleId: string,
  moduleName: string,
  description: string,
  createdAt: Date,
  modifiedAt: Date
}

export interface PermissionOptions {
  userRightsMasterId: string,
  moduleId: string,
  rightName: string,
  description: string,
  url: string,
  view: boolean,
  create: boolean,
  edit: boolean,
  delete: boolean
}

export interface ProductTypes {
  productID: string,
  name: string,
  description: string,
  productTypeID: number,
  isActive: boolean,
  createdAt: Date,
  modifiedAt: Date
}

export interface CustomerDetails {
  clientServerID: string;
  clientID: string;
  client: string;
  serverID: string;
  serverName: string;
  databaseID: string;
  databaseName: string;
  productID: string;
  product: string;
  alias: string;
  isActive: boolean;
  createdAt: Date;  
  modifiedAt: Date; 
}
