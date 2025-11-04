import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';
import { Charge, ChargePayload, Expense, ExpensePayload } from '../types/index.ts';
import { apiClient } from '../utils/api.ts';
import { useAuth } from './AuthContext.tsx';

interface DataContextType {
  expenses: Expense[];
  charges: Charge[];
  isLoading: boolean;
  error: string | null;
  refreshAll: () => Promise<void>;
  addExpense: (expense: ExpensePayload) => Promise<Expense>;
  updateExpense: (expense: Expense) => Promise<Expense>;
  deleteExpense: (id: number) => Promise<void>;
  addCharge: (charge: ChargePayload) => Promise<Charge>;
  updateCharge: (charge: Charge) => Promise<Charge>;
  deleteCharge: (id: number) => Promise<void>;
}

type ExpenseResponse = {
  id: number;
  description: string;
  amount: string | number;
  category: string;
  date: string;
  created_at?: string;
  updated_at?: string;
};

type ChargeResponse = {
  id: number;
  description: string;
  amount: string | number;
  category: string;
  due_date: string;
  is_paid: boolean | number;
  created_at?: string;
  updated_at?: string;
};

const mapExpense = (payload: ExpenseResponse): Expense => ({
  id: payload.id,
  description: payload.description,
  amount: typeof payload.amount === 'string' ? parseFloat(payload.amount) : payload.amount,
  category: payload.category,
  date: payload.date,
});

const mapCharge = (payload: ChargeResponse): Charge => ({
  id: payload.id,
  description: payload.description,
  amount: typeof payload.amount === 'string' ? parseFloat(payload.amount) : payload.amount,
  category: payload.category,
  dueDate: payload.due_date,
  isPaid: Boolean(payload.is_paid),
});

const serializeCharge = (charge: ChargePayload | Charge) => ({
  description: charge.description,
  amount: charge.amount,
  category: charge.category,
  due_date: charge.dueDate,
  is_paid: charge.isPaid,
});

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadResources = useCallback(async () => {
    if (!isAuthenticated) {
      setExpenses([]);
      setCharges([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [expenseResponse, chargeResponse] = await Promise.all([
        apiClient.get<{ data: ExpenseResponse[] }>('/expenses'),
        apiClient.get<{ data: ChargeResponse[] }>('/charges'),
      ]);
      setExpenses(expenseResponse.data.map(mapExpense));
      setCharges(chargeResponse.data.map(mapCharge));
    } catch (err) {
      console.error('Failed loading financial data', err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: unknown }).message ?? 'Unable to fetch data at the moment.')
          : 'Unable to fetch data at the moment.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadResources();
    } else {
      setExpenses([]);
      setCharges([]);
    }
  }, [isAuthenticated, loadResources]);

  const addExpense = useCallback(async (expense: ExpensePayload) => {
    const response = await apiClient.post<{ data: ExpenseResponse }>('/expenses', expense);
    const normalized = mapExpense(response.data);
    setExpenses((prev) => [normalized, ...prev.filter((item) => item.id !== normalized.id)]);
    return normalized;
  }, []);

  const updateExpense = useCallback(async (expense: Expense) => {
    const { id, ...payload } = expense;
    const response = await apiClient.put<{ data: ExpenseResponse }>(`/expenses/${id}`, payload);
    const normalized = mapExpense(response.data);
    setExpenses((prev) => prev.map((item) => (item.id === id ? normalized : item)));
    return normalized;
  }, []);

  const deleteExpense = useCallback(async (id: number) => {
    await apiClient.delete<{ message: string }>(`/expenses/${id}`);
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addCharge = useCallback(async (charge: ChargePayload) => {
    const response = await apiClient.post<{ data: ChargeResponse }>('/charges', serializeCharge(charge));
    const normalized = mapCharge(response.data);
    setCharges((prev) => [normalized, ...prev.filter((item) => item.id !== normalized.id)]);
    return normalized;
  }, []);

  const updateCharge = useCallback(async (charge: Charge) => {
    const response = await apiClient.put<{ data: ChargeResponse }>(
      `/charges/${charge.id}`,
      serializeCharge(charge)
    );
    const normalized = mapCharge(response.data);
    setCharges((prev) => prev.map((item) => (item.id === charge.id ? normalized : item)));
    return normalized;
  }, []);

  const deleteCharge = useCallback(async (id: number) => {
    await apiClient.delete<{ message: string }>(`/charges/${id}`);
    setCharges((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({
      expenses,
      charges,
      isLoading,
      error,
      refreshAll: loadResources,
      addExpense,
      updateExpense,
      deleteExpense,
      addCharge,
      updateCharge,
      deleteCharge,
    }),
    [addCharge, addExpense, charges, deleteCharge, deleteExpense, error, expenses, isLoading, loadResources, updateCharge, updateExpense]
  );

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
