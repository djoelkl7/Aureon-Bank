
export enum UserRole {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED'
}

export interface Transaction {
  id: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  category: string;
  description: string;
  date: string;
  to?: string;
  from?: string;
}

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  term: number; // months
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface SubAccount {
  id: string;
  name: string;
  balance: number;
  type: 'SAVINGS' | 'CHECKING' | 'PAYROLL';
}

export interface RecurringPayment {
  id: string;
  amount: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  duration: number; // number of times
  occurences: number; // times already occurred
  description: string;
  nextDate: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
}

export interface UserSettings {
  hideBalance: boolean;
  analyticsFocus: 'GROWTH' | 'SPENDING';
  transferLimit: number;
  biometricLogin: boolean;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  balance: number;
  transactions: Transaction[];
  loans: Loan[];
  recurringPayments: RecurringPayment[];
  settings: UserSettings;
  subAccounts?: SubAccount[];
  failedLoginAttempts: number;
  passportUrl?: string;
  idNumber?: string;
  email?: string;
}

export interface BankState {
  currentUser: User | null;
  allUsers: User[];
  enterpriseACCOUNTSMode: boolean;
  language: 'EN' | 'ES' | 'FR';
}

export type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CREATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: UserSettings }
  | { type: 'TOGGLE_ACCOUNTS_MODE' }
  | { type: 'SET_LANGUAGE'; payload: 'EN' | 'ES' | 'FR' }
  | { type: 'APPROVE_LOAN'; payload: { loanId: string; userId: string } }
  | { type: 'REJECT_LOAN'; payload: { loanId: string; userId: string } }
  | { type: 'LOCK_USER'; payload: string }
  | { type: 'UNLOCK_USER'; payload: string }
  | { type: 'ADMIN_UPDATE_BALANCE'; payload: { userId: string; newBalance: number } }
  | { type: 'ADD_RECURRING'; payload: RecurringPayment }
  | { type: 'CANCEL_RECURRING'; payload: string };
