import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Expense, Charge } from '../types/index.ts';
import { MOCK_EXPENSES, MOCK_CHARGES } from '../utils/mockData.ts';

interface DataContextType {
  expenses: Expense[];
  charges: Charge[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addCharge: (charge: Omit<Charge, 'id'>) => void;
  updateCharge: (charge: Charge) => void;
  deleteCharge: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [charges, setCharges] = useState<Charge[]>(MOCK_CHARGES);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...expense, id: Date.now().toString() }]);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const addCharge = (charge: Omit<Charge, 'id'>) => {
    setCharges([...charges, { ...charge, id: Date.now().toString() }]);
  };
  
  const updateCharge = (updatedCharge: Charge) => {
    setCharges(charges.map(chg => chg.id === updatedCharge.id ? updatedCharge : chg));
  };

  const deleteCharge = (id: string) => {
    setCharges(charges.filter(chg => chg.id !== id));
  };


  return (
    <DataContext.Provider value={{ expenses, charges, addExpense, updateExpense, deleteExpense, addCharge, updateCharge, deleteCharge }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
