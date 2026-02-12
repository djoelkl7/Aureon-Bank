
import { UserRole, UserStatus, User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'DolmatBin',
    name: 'Dolmat Bin',
    role: UserRole.PERSONAL,
    status: UserStatus.LOCKED,
    balance: 4200000.00,
    failedLoginAttempts: 0,
    transactions: [
      { id: 't1', type: 'DEBIT', amount: 50000, category: 'Investment', description: 'Gold Payment', date: '2024-05-10' }
    ],
    loans: []
  },
  {
    id: '2',
    username: 'SarahLee',
    name: 'Sarah Lee',
    role: UserRole.PERSONAL,
    status: UserStatus.ACTIVE,
    balance: 24580.75,
    failedLoginAttempts: 0,
    transactions: [
      { id: 't2', type: 'CREDIT', amount: 5000, category: 'Salary', description: 'Monthly Payroll', date: '2024-05-01' },
      { id: 't3', type: 'DEBIT', amount: 120, category: 'Dining', description: 'Starbucks Coffee', date: '2024-05-05' }
    ],
    loans: []
  },
  {
    id: '3',
    username: 'NovaCorp',
    name: 'Nova Corporation',
    role: UserRole.BUSINESS,
    status: UserStatus.ACTIVE,
    balance: 1280450.00,
    failedLoginAttempts: 0,
    subAccounts: [
      { id: 's1', name: 'Main Operating', balance: 1000000.00, type: 'CHECKING' },
      { id: 's2', name: 'Payroll Reserve', balance: 250000.00, type: 'PAYROLL' },
      { id: 's3', name: 'Tax Savings', balance: 30450.00, type: 'SAVINGS' }
    ],
    transactions: [],
    loans: []
  },
  {
    id: '4',
    username: 'AdminMaster',
    name: 'Super Admin',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    balance: 0,
    failedLoginAttempts: 0,
    transactions: [],
    loans: []
  }
];

export const TRANSLATIONS = {
  EN: {
    welcome: 'Welcome back',
    balance: 'Total Balance',
    transfer: 'Transfer',
    payBills: 'Pay Bills',
    applyLoan: 'Apply for Loan',
    history: 'Transaction History',
    analytics: 'Analytics',
    logout: 'Logout',
    accounts: 'Accounts',
    settings: 'Settings',
    demoMode: 'Enterprise ACCOUNTS Mode',
    status: 'Status',
    role: 'Role',
    action: 'Actions'
  },
  ES: {
    welcome: 'Bienvenido de nuevo',
    balance: 'Saldo Total',
    transfer: 'Transferir',
    payBills: 'Pagar Facturas',
    applyLoan: 'Solicitar Préstamo',
    history: 'Historial',
    analytics: 'Analítica',
    logout: 'Cerrar Sesión',
    accounts: 'Cuentas',
    settings: 'Ajustes',
    demoMode: 'Modo ACCOUNTS',
    status: 'Estado',
    role: 'Rol',
    action: 'Acciones'
  },
  FR: {
    welcome: 'Bon retour',
    balance: 'Solde Total',
    transfer: 'Transfert',
    payBills: 'Payer Factures',
    applyLoan: 'Demande de prêt',
    history: 'Historique',
    analytics: 'Analytique',
    logout: 'Déconnexion',
    accounts: 'Comptes',
    settings: 'Paramètres',
    demoMode: 'Mode ACCOUNTS',
    status: 'Statut',
    role: 'Rôle',
    action: 'Actions'
  }
};
