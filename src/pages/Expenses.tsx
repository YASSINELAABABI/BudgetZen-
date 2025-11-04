import React, { useMemo, useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import Card from '../components/Card.tsx';
import Modal from '../components/Modal.tsx';
import ExpenseForm from '../components/ExpenseForm.tsx';
import { Expense, ExpensePayload } from '../types/index.ts';
import { useData } from '../context/DataContext.tsx';

interface FormState {
  mode: 'create' | 'edit';
  expense: Expense | null;
  isOpen: boolean;
  error: string | null;
}

const DEFAULT_FORM_STATE: FormState = {
  mode: 'create',
  expense: null,
  isOpen: false,
  error: null,
};

const Expenses: React.FC = () => {
  const { expenses, isLoading, error, addExpense, updateExpense, deleteExpense } = useData();
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setFormState({
      mode: 'create',
      expense: null,
      isOpen: true,
      error: null,
    });
  };

  const openEditModal = (expense: Expense) => {
    setFormState({
      mode: 'edit',
      expense,
      isOpen: true,
      error: null,
    });
  };

  const closeModal = () => {
    setFormState(DEFAULT_FORM_STATE);
    setIsSubmitting(false);
  };

  const handleSaveExpense = async (payload: ExpensePayload | Expense) => {
    setIsSubmitting(true);
    try {
      if ('id' in payload) {
        await updateExpense(payload);
      } else {
        await addExpense(payload);
      }
      closeModal();
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : 'Enregistrement impossible pour le moment.';
      setFormState((prev) => ({ ...prev, error: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (expenseId: number) => {
    const confirmation = window.confirm(
      'Voulez-vous vraiment supprimer cette depense ?'
    );
    if (!confirmation) {
      return;
    }
    try {
      await deleteExpense(expenseId);
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : 'Suppression impossible pour le moment.';
      alert(message);
    }
  };

  const totalAmount = useMemo(
    () => expenses.reduce((sum, current) => sum + current.amount, 0),
    [expenses]
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              Gestion des depenses
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Suivez vos depenses quotidiennes et optimisez votre budget.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle depense
          </button>
        </div>

        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total depenses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(totalAmount)}
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {expenses.length} depense{expenses.length > 1 ? 's' : ''}
            </div>
          </div>
        </Card>

        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-600 dark:text-gray-400">
              Chargement des depenses...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-100">
              {error}
            </div>
          ) : expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-gray-600 dark:text-gray-400">
              <div className="rounded-full bg-primary-50 p-3 text-primary-600 dark:bg-primary-900/30 dark:text-primary-200">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Aucune depense pour le moment
                </h3>
                <p className="text-sm">
                  Ajoutez votre premiere depense pour commencer a suivre vos finances.
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="mt-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Ajouter une depense
              </button>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-100 shadow-sm dark:border-gray-700 dark:shadow-lg">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/80">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Categorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {expense.description}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {expense.category}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Intl.DateTimeFormat('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }).format(new Date(expense.date))}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(expense.amount)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(expense)}
                            className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                          >
                            <Edit3 className="mr-1.5 h-4 w-4" />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 dark:border-red-700 dark:bg-red-900/30 dark:text-red-100 dark:hover:bg-red-900/50"
                          >
                            <Trash2 className="mr-1.5 h-4 w-4" />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={formState.isOpen}
        onClose={closeModal}
        title={
          formState.mode === 'create'
            ? 'Nouvelle depense'
            : 'Modifier la depense'
        }
      >
        <ExpenseForm
          onSubmit={handleSaveExpense}
          onCancel={closeModal}
          initialData={formState.expense}
          isSubmitting={isSubmitting}
          serverError={formState.error}
        />
      </Modal>
    </>
  );
};

export default Expenses;

