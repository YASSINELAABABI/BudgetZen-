
export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Charge {
  id: number;
  description: string;
  amount: number;
  category: string;
  dueDate: string;
  isPaid: boolean;
}

export type ExpensePayload = Omit<Expense, 'id'>;
export type ChargePayload = Omit<Charge, 'id'>;
