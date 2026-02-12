
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { BankState, Action, User, UserRole, UserStatus, Transaction, Loan } from '../types';
import { INITIAL_USERS } from '../constants';

const initialState: BankState = {
  currentUser: null,
  allUsers: INITIAL_USERS,
  enterpriseACCOUNTSMode: false,
  language: 'EN'
};

const BankContext = createContext<{
  state: BankState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function bankReducer(state: BankState, action: Action): BankState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'TOGGLE_ACCOUNTS_MODE':
      return { ...state, enterpriseACCOUNTSMode: !state.enterpriseACCOUNTSMode };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'UPDATE_USER':
      const updatedAllUsers = state.allUsers.map(u => u.id === action.payload.id ? action.payload : u);
      return {
        ...state,
        allUsers: updatedAllUsers,
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };
    case 'APPROVE_LOAN':
      return {
        ...state,
        allUsers: state.allUsers.map(u => {
          if (u.id === action.payload.userId) {
            const loanIndex = u.loans.findIndex(l => l.id === action.payload.loanId);
            if (loanIndex !== -1) {
              const updatedLoans = [...u.loans];
              const loan = updatedLoans[loanIndex];
              updatedLoans[loanIndex] = { ...loan, status: 'APPROVED' };
              const newBalance = u.balance + loan.amount;
              const newTransaction: Transaction = {
                id: `t-loan-${Date.now()}`,
                type: 'CREDIT',
                amount: loan.amount,
                category: 'Loan',
                description: `Loan ${loan.id} Disbursement`,
                date: new Date().toISOString().split('T')[0]
              };
              return { ...u, balance: newBalance, loans: updatedLoans, transactions: [newTransaction, ...u.transactions] };
            }
          }
          return u;
        }),
        currentUser: state.currentUser // Admin remains current user
      };
    case 'REJECT_LOAN':
      return {
        ...state,
        allUsers: state.allUsers.map(u => {
          if (u.id === action.payload.userId) {
            const updatedLoans = u.loans.map(l => l.id === action.payload.loanId ? { ...l, status: 'REJECTED' as const } : l);
            return { ...u, loans: updatedLoans };
          }
          return u;
        })
      };
    case 'LOCK_USER':
      return {
        ...state,
        allUsers: state.allUsers.map(u => u.id === action.payload ? { ...u, status: UserStatus.LOCKED } : u)
      };
    case 'UNLOCK_USER':
      return {
        ...state,
        allUsers: state.allUsers.map(u => u.id === action.payload ? { ...u, status: UserStatus.ACTIVE } : u)
      };
    case 'ADMIN_UPDATE_BALANCE':
      return {
        ...state,
        allUsers: state.allUsers.map(u => u.id === action.payload.userId ? { ...u, balance: action.payload.newBalance } : u)
      };
    default:
      return state;
  }
}

export const BankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bankReducer, initialState);

  // Sync currentUser with updated data from allUsers
  useEffect(() => {
    if (state.currentUser) {
      const refreshedUser = state.allUsers.find(u => u.id === state.currentUser?.id);
      if (refreshedUser && JSON.stringify(refreshedUser) !== JSON.stringify(state.currentUser)) {
        // Only update if data actually changed to avoid loop
      }
    }
  }, [state.allUsers, state.currentUser]);

  return (
    <BankContext.Provider value={{ state, dispatch }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) throw new Error('useBank must be used within a BankProvider');
  return context;
};
