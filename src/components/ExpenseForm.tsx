import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Expense } from '../types/index.ts';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'> | Expense) => void;
  onCancel: () => void;
  initialData?: Expense | null;
}

type FormData = {
  description: string;
  amount: number;
  category: string;
  date: string;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      description: '',
      amount: undefined,
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        description: initialData.description,
        amount: initialData.amount,
        category: initialData.category,
        date: initialData.date,
      });
    } else {
      reset({
        description: '',
        amount: undefined,
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, reset]);
  
  const handleFormSubmit = (data: FormData) => {
    if (initialData) {
        onSubmit({ ...initialData, ...data });
    } else {
        onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <input 
          type="text" 
          id="description" 
          {...register('description', { required: 'Description is required.' })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
        <input 
          type="number" 
          id="amount" 
          step="0.01"
          {...register('amount', {
            required: 'Amount is required.',
            valueAsNumber: true,
            min: { value: 0.01, message: 'Please enter a positive amount.' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
        <select 
          id="category" 
          {...register('category', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Utilities</option>
            <option>Miscellaneous</option>
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
        <input 
          type="date" 
          id="date" 
          {...register('date', { required: 'Date is required.' })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700">{initialData ? 'Update' : 'Save'}</button>
      </div>
    </form>
  );
};

export default ExpenseForm;