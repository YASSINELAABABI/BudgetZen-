import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Charge } from '../types/index.ts';

interface ChargeFormProps {
  onSubmit: (charge: Omit<Charge, 'id'> | Charge) => void | Promise<void>;
  onCancel: () => void;
  initialData?: Charge | null;
  isSubmitting?: boolean;
  serverError?: string | null;
}

interface FormData {
  description: string;
  amount: number | undefined;
  category: string;
  dueDate: string;
  isPaid: boolean;
}

const CHARGE_CATEGORIES = [
  'Logement',
  'Transport',
  'Services publics',
  'Assurances',
  'Dettes',
  'Abonnements',
  'Autres',
];

const ChargeForm: React.FC<ChargeFormProps> = ({
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
      category: CHARGE_CATEGORIES[0],
      dueDate: today,
      isPaid: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        description: initialData.description,
        amount: initialData.amount,
        category: initialData.category,
        dueDate: initialData.dueDate,
        isPaid: initialData.isPaid,
      });
    } else {
      reset({
        description: '',
        amount: undefined,
        category: CHARGE_CATEGORIES[0],
        dueDate: today,
        isPaid: false,
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
          placeholder="Ex : Facture Internet, assurance auto..."
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
          <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Echeance
          </label>
          <input
            type="date"
            id="dueDate"
            {...register('dueDate', { required: 'La date d\'echeance est obligatoire.' })}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50"
          />
          {errors.dueDate && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">{errors.dueDate.message}</p>
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
          {CHARGE_CATEGORIES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800/60">
        <input
          type="checkbox"
          id="isPaid"
          {...register('isPaid')}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-500"
        />
        <label htmlFor="isPaid" className="text-sm text-gray-700 dark:text-gray-200">
          Marquer comme payee
        </label>
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

export default ChargeForm;


