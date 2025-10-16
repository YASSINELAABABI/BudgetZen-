import { Expense, Charge } from '../types/index.ts';

export const MOCK_EXPENSES: Expense[] = [
  { id: '1', description: 'Groceries', amount: 75.50, category: 'Food', date: '2024-07-20' },
  { id: '2', description: 'Gasoline', amount: 50.00, category: 'Transport', date: '2024-07-19' },
  { id: '3', description: 'Movie Tickets', amount: 30.00, category: 'Entertainment', date: '2024-07-18' },
  { id: '4', description: 'Dinner Out', amount: 120.00, category: 'Food', date: '2024-07-17' },
  { id: '5', description: 'Electric Bill', amount: 95.20, category: 'Utilities', date: '2024-07-15' },
];

export const MOCK_CHARGES: Charge[] = [
    { id: '101', description: 'Rent', amount: 1200.00, category: 'Housing', dueDate: '2024-08-01', isPaid: false },
    { id: '102', description: 'Car Payment', amount: 350.00, category: 'Transport', dueDate: '2024-08-05', isPaid: false },
    { id: '103', description: 'Student Loan', amount: 200.00, category: 'Debt', dueDate: '2024-08-10', isPaid: true },
    { id: '104', description: 'Internet Bill', amount: 60.00, category: 'Utilities', dueDate: '2024-08-15', isPaid: false },
];
