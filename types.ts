
export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
  TRANSFER = 'Transfer',
  LOAN = 'Loan',
}

export enum IncomeSubtype {
  INSTALLMENT = 'Installment',
  RENT = 'Rent',
}

export enum LoanSubtype {
  RECEIVE = 'Receive Loan',
  REPAY = 'Repay Loan',
}

export enum InvoiceStatus {
  DRAFT = 'Draft',
  UNPAID = 'Unpaid',
  PAID = 'Paid',
  OVERDUE = 'Overdue'
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  contactId: string;
  projectId?: string;
  amount: number;
  issueDate: string; // ISO
  dueDate: string; // ISO
  status: InvoiceStatus;
  description: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  contactId: string;
  projectId?: string;
  amount: number;
  issueDate: string; // ISO
  dueDate: string; // ISO
  status: InvoiceStatus; // Using same status enum for simplicity
  description: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  subtype?: IncomeSubtype | LoanSubtype;
  amount: number;
  date: string; // ISO string
  description: string;
  accountId: string; // For Income, Expense, Loan
  fromAccountId?: string; // For Transfer
  toAccountId?: string; // For Transfer
  contactId?: string;
  projectId?: string;
  categoryId?: string;
  invoiceId?: string;
  billId?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export enum ContactType {
    OWNER = 'Owner',
    TENANT = 'Tenant',
    VENDOR = 'Vendor/Supplier'
}

export interface Contact {
  id: string;
  name: string;
  type: ContactType;
}

export interface Project {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType.INCOME | TransactionType.EXPENSE;
}

export type Page = 'transactions' | 'dashboard' | 'settings' | 'invoices';

export interface AppState {
  accounts: Account[];
  contacts: Contact[];
  projects: Project[];
  categories: Category[];
  transactions: Transaction[];
  invoices: Invoice[];
  bills: Bill[];
}

export type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'ADD_BILL'; payload: Bill }
  | { type: 'UPDATE_BILL'; payload: Bill }
  | { type: 'DELETE_BILL'; payload: string };
