import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Expense } from '../types/index.ts';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'> | Expense) => void | Promise<void>;
  onCancel: () => void;
  initialData?: Expense | null;
  isSubmitting?: boolean;
  serverError?: string | null;
}

interface FormData {
  description: string;
  amount: number | undefined;
  category: string;
  date: string;
}

const CATEGORIES = [
  'Alimentation',
  'Transport',
  'Logement',
  'Divertissement',
  'Services publics',
  'Sante',
  'Education',
  'Autres',
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
  serverError = null,
}) => {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      description: '',
      amount: undefined,
      category: CATEGORIES[0],
      date: today,
    },
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
        category: CATEGORIES[0],
        date: today,
      });
    }
  }, [initialData, reset, today]);

  const handleFormSubmit = async (data: FormData) => {
    const payload = initialData ? { ...initialData, ...data } : data;
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Description
        </label>
        <input
          type="text"
          id="description"
          {...register('description', { required: 'La description est obligatoire.' })}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50"
          placeholder="Ex: Courses, essence, etc."
        />
        {errors.description && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Montant
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            {...register('amount', {
              required: 'Le montant est obligatoire.',
              valueAsNumber: true,
              min: { value: 0.01, message: 'Entrez un montant superieur a 0.' },
            })}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Date
          </label>
          <input
            type="date"
            id="date"
            {...register('date', { required: 'La date est obligatoire.' })}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50"
            max={today}
          />
          {errors.date && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">{errors.date.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Categorie
        </label>
        <select
          id="category"
          {...register('category', { required: true })}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50"
        >
          {CATEGORIES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
          {serverError}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900"
        >
          {isSubmitting ? 'Enregistrement...' : initialData ? 'Mettre a jour' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;

