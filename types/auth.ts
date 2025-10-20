// types/auth.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
  usertypeid?: string;
}

export interface ResetRequest {
  confirmPassword: string;
  password: string;
}

export interface RoleType {
  userTypeId: string;
  typeName: string;
  description: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface UserType {
  userId: string;
  userName: string;
  email: string;
  userTypeId: string;
  typeName?: string;
  clientID: string;
  organizationName?: string;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export interface PermissionModuleType {
  moduleId: string;
  moduleName: string;
  description: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface PermissionOptions {
  userRightsMasterId: string;
  moduleId: string;
  rightName: string;
  description: string;
  url: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface ProductTypes {
  productID: string;
  name: string;
  description: string;
  productTypeID: number;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;
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
  statusID: number;
  statusName: string;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export interface Addons {
  addonID: string;
  name: string;
  description: string;
  addonPrice: number;
  currencyID: string;
  currencyCode: string;
  createdAt: Date;
  modifiedAt: Date;
  isActive: boolean;
}

export interface PaymentGateway {
  gatewayID: string;
  providerName: string;
  apiKey: string;
  secretKey: string;
  endpointURL: string;
  supportedModes: string;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export interface Currency {
  currencyCode: string;
  countryName: string;
  symbol: string;
  decimalPlaces: number;
}

export interface ServerType {
  serverName: string;
  Region: string;
  ip: string;
  remarks: string;
  isActive: boolean;
  databaseLimit: number;
}

export interface DatabaseType {
  databaseName: string;
  userLimit: number;
  isActive: boolean;
  product: string;
  version: string;
  server: string;
}

export interface PlanType {
  planID: string;
  planName: string;
  planPrice: number;
  currencyID: string;
  billingCycle: string;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;
  code: string;
  currencyCode: string;
  features: {
    featureID: string;
    planID: string;
    featureName: string;
    remarks: string | null;
    status: boolean;
    createdAt: string;
    modifiedAt: string;
  }[];
}

export interface CurrencyDetailsType {
  currencyID: string;
  currencyCode: string;
  symbol: string;
  decimalPlaces: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ProductVersion {
  versionID: string;
  productID: string;
  versionNumber: string;
  releaseDate: Date;
  basePrice: number;
  currencyID: string;
  createdAt: string;
  modifiedAt: string;
  isActive: boolean;
  currencyCode: string;
  addons: Addons[];
  plans: PlanType[];
}

export interface LeadsType {
  leadID: string;
  userID: string;
  countryID: string;
  countryName: string;
  fullName: string;
  userName: string;
  email: string;
  mobile: string | null;
  source: string;
  status: number;
  priority: string | null;
}

export interface PaymentDetails {
  paymentID: string;
  subscriptionID: string;
  purchaseOrderID: string;
  paidOn: string;
  amountPaid: number;
  taxAmount: number;
  currencyID: string;
  currencyCode: string;
  paymentStatus: number;
  status: string;
  paymentMode: string;
  remarks: string;
  isInvoiced: string;
}