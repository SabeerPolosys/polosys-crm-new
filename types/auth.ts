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
  pcode: string;
  iscommon: boolean;
}

export interface CustomerDetails {
  // clientServerID: string;
  // clientID: string;
  // client: string;
  // serverID: string;
  // serverName: string;
  // databaseID: string;
  // databaseName: string;
  // productID: string;
  // product: string;
  // alias: string;
  // statusID: number;
  // statusName: string;
  // isActive: boolean;
  // createdAt: Date;
  // modifiedAt: Date;
  clientID: string;
  organizationName: string;
  email: string;
  mobile: string;
  countryID: string;
  countryName: string;
  userID: string;
  userName: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  statusID: number;
  statusName: string;
  startDate: string;
  endDate: string;
  planName: string;
  planCode: string;
  eName: string;
  eCode: string;
  name: string;
  pcode: string;
  typeName: string;
  paymentID: string;
  purchaseOrderID: string;
  paymentMode: string | null;
  amountPaid: string | null;
  totalPrice: string | null;
  itemPrice: string | null;
  paidOn: string;
  purchaseDate: string;
  databaseName: string;
  serverName: string;
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
  serverID: string;
  serverName: string;
  region: string;
  createdAt: string;
  modifiedAt: string;
  isActive: boolean;
  ipAddress: string;
  validity: Date;
  isDefault: boolean;
  remarks: string;
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

export interface ProductEdition {
  editionId: string;
  productId: string;
  eCode: string;
  eName: string;
  pcode: string;
  productName: string;
  noOfUsers: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  monthlyPrice: number;
  yearlyPrice: number;
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
  source: string | null;
  status: number;
  priority: string | null;
  clientID: string;
  startDate: string;
  endDate: string;
  planID: string;
  planName: string;
  planCode: string;
  productName: string | null;
  productCode: string | null;
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
export interface InvoiceDetails {
  invoiceID: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  taxAmount: number;
  total: number;
  paymentID: string;
  invoiceDate: string;
}
