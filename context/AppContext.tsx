
import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { AppState, AppAction, TransactionType, LoanSubtype, InvoiceStatus } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const initialState: AppState = {
  accounts: [],
  contacts: [],
  projects: [],
  categories: [],
  transactions: [],
  invoices: [],
  bills: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_STATE':
        return action.payload;
    case 'ADD_TRANSACTION': {
        const tx = action.payload;
        const newTransactions = [...state.transactions, tx];
        const newAccounts = state.accounts.map(acc => {
            if (tx.type === TransactionType.INCOME) {
                if (acc.id === tx.accountId) return {...acc, balance: acc.balance + tx.amount};
            } else if (tx.type === TransactionType.EXPENSE) {
                if (acc.id === tx.accountId) return {...acc, balance: acc.balance - tx.amount};
            } else if (tx.type === TransactionType.TRANSFER) {
                if (acc.id === tx.fromAccountId) return {...acc, balance: acc.balance - tx.amount};
                if (acc.id === tx.toAccountId) return {...acc, balance: acc.balance + tx.amount};
            } else if (tx.type === TransactionType.LOAN) {
                if(tx.subtype === LoanSubtype.RECEIVE && acc.id === tx.accountId) return {...acc, balance: acc.balance + tx.amount};
                if(tx.subtype === LoanSubtype.REPAY && acc.id === tx.accountId) return {...acc, balance: acc.balance - tx.amount};
            }
            return acc;
        });

        let newInvoices = state.invoices;
        if (tx.invoiceId) {
            newInvoices = state.invoices.map(inv => inv.id === tx.invoiceId ? { ...inv, status: InvoiceStatus.PAID } : inv);
        }
        let newBills = state.bills;
        if (tx.billId) {
            newBills = state.bills.map(bill => bill.id === tx.billId ? { ...bill, status: InvoiceStatus.PAID } : bill);
        }

        return { ...state, transactions: newTransactions, accounts: newAccounts, invoices: newInvoices, bills: newBills };
    }
    case 'DELETE_TRANSACTION': {
        const txToDelete = state.transactions.find(tx => tx.id === action.payload);
        if (!txToDelete) return state;

        const updatedAccountsAfterDelete = state.accounts.map(acc => {
            if (txToDelete.type === TransactionType.INCOME) {
                if (acc.id === txToDelete.accountId) return {...acc, balance: acc.balance - txToDelete.amount};
            } else if (txToDelete.type === TransactionType.EXPENSE) {
                if (acc.id === txToDelete.accountId) return {...acc, balance: acc.balance + txToDelete.amount};
            } else if (txToDelete.type === TransactionType.TRANSFER) {
                if (acc.id === txToDelete.fromAccountId) return {...acc, balance: acc.balance + txToDelete.amount};
                if (acc.id === txToDelete.toAccountId) return {...acc, balance: acc.balance - txToDelete.amount};
            } else if (txToDelete.type === TransactionType.LOAN) {
                if(txToDelete.subtype === LoanSubtype.RECEIVE && acc.id === txToDelete.accountId) return {...acc, balance: acc.balance - txToDelete.amount};
                if(txToDelete.subtype === LoanSubtype.REPAY && acc.id === txToDelete.accountId) return {...acc, balance: acc.balance + txToDelete.amount};
            }
            return acc;
        });

        let newInvoices = state.invoices;
        if (txToDelete.invoiceId) {
            newInvoices = state.invoices.map(inv => inv.id === txToDelete.invoiceId ? { ...inv, status: InvoiceStatus.UNPAID } : inv);
        }
        let newBills = state.bills;
        if (txToDelete.billId) {
            newBills = state.bills.map(bill => bill.id === txToDelete.billId ? { ...bill, status: InvoiceStatus.UNPAID } : bill);
        }

        return {
            ...state,
            transactions: state.transactions.filter(tx => tx.id !== action.payload),
            accounts: updatedAccountsAfterDelete,
            invoices: newInvoices,
            bills: newBills,
        };
    }
    case 'ADD_ACCOUNT':
        return { ...state, accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
        return { ...state, accounts: state.accounts.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE_ACCOUNT':
        if (state.transactions.some(t => t.accountId === action.payload || t.fromAccountId === action.payload || t.toAccountId === action.payload)) {
            alert("Cannot delete account with existing transactions.");
            return state;
        }
        return { ...state, accounts: state.accounts.filter(a => a.id !== action.payload) };

    case 'ADD_CONTACT':
        return { ...state, contacts: [...state.contacts, action.payload] };
    case 'UPDATE_CONTACT':
        return { ...state, contacts: state.contacts.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CONTACT':
        return { ...state, contacts: state.contacts.filter(c => c.id !== action.payload) };

    case 'ADD_PROJECT':
        return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
        return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PROJECT':
        return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };

    case 'ADD_CATEGORY':
        return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
        return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CATEGORY':
        return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    
    case 'ADD_INVOICE':
        return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
        return { ...state, invoices: state.invoices.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_INVOICE':
        return { ...state, invoices: state.invoices.filter(i => i.id !== action.payload) };

    case 'ADD_BILL':
        return { ...state, bills: [...state.bills, action.payload] };
    case 'UPDATE_BILL':
        return { ...state, bills: state.bills.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'DELETE_BILL':
        return { ...state, bills: state.bills.filter(b => b.id !== action.payload) };


    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [storedState, setStoredState] = useLocalStorage<AppState>('finance-tracker-state', initialState);
    const [state, dispatch] = useReducer(appReducer, storedState);

    useEffect(() => {
        setStoredState(state);
    }, [state, setStoredState]);

    useEffect(() => {
        const mergedState = { ...initialState, ...storedState };
        dispatch({ type: 'SET_STATE', payload: mergedState });
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
