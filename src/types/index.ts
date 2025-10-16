
export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Charge {
  id: string;
  description: string;
  amount: number;
  category: string;
  dueDate: string;
  isPaid: boolean;
}
