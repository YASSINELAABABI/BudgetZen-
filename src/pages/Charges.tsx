import React, { useMemo, useState } from 'react';
import { Check, Clock, Edit3, Plus, Trash2 } from 'lucide-react';
import Card from '../components/Card.tsx';
import Modal from '../components/Modal.tsx';
import ChargeForm from '../components/ChargeForm.tsx';
import { Charge, ChargePayload } from '../types/index.ts';
import { useData } from '../context/DataContext.tsx';

interface ChargeModalState {
  mode: 'create' | 'edit';
  charge: Charge | null;
  isOpen: boolean;
  error: string | null;
}

const DEFAULT_STATE: ChargeModalState = {
  mode: 'create',
  charge: null,
  isOpen: false,
  error: null,
};

const Charges: React.FC = () => {
  const { charges, isLoading, error, addCharge, updateCharge, deleteCharge } = useData();
  const [modalState, setModalState] = useState<ChargeModalState>(DEFAULT_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () =>
    setModalState({
      mode: 'create',
      charge: null,
      isOpen: true,
      error: null,
    });

  const openEditModal = (charge: Charge) =>
    setModalState({
      mode: 'edit',
      charge,
      isOpen: true,
      error: null,
    });

  const closeModal = () => {
    setModalState(DEFAULT_STATE);
    setIsSubmitting(false);
  };

  const handleSaveCharge = async (payload: ChargePayload | Charge) => {
    setIsSubmitting(true);
    try {
      if ('id' in payload) {
        await updateCharge(payload);
      } else {
        await addCharge(payload);
      }
      closeModal();
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : 'Impossible de sauvegarder la charge. Merci de reessayer.';
      setModalState((prev) => ({ ...prev, error: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (chargeId: number) => {
    const confirmation = window.confirm('Supprimer cette charge ?');
    if (!confirmation) {
      return;
    }
    try {
      await deleteCharge(chargeId);
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : 'Suppression impossible pour le moment.';
      alert(message);
    }
  };

  const totals = useMemo(() => {
    const totalAmount = charges.reduce((sum, item) => sum + item.amount, 0);
    const upcoming = charges.filter((item) => !item.isPaid).length;
    const paid = charges.length - upcoming;

    return { totalAmount, upcoming, paid };
  }, [charges]);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Gestion des charges</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visualisez vos charges fixes et anticipez les echeances a venir.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle charge
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg">
            <p className="text-sm font-medium text-primary-100 uppercase tracking-wide">Montant mensuel</p>
            <p className="mt-1 text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              }).format(totals.totalAmount)}
            </p>
          </Card>
          <Card className="shadow-sm">
            <div className="flex items-center gap-3">
              <Clock className="h-10 w-10 rounded-full bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">A venir</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {totals.upcoming} charge{totals.upcoming > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </Card>
          <Card className="shadow-sm">
            <div className="flex items-center gap-3">
              <Check className="h-10 w-10 rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-300" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payees</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {totals.paid} charge{totals.paid > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-600 dark:text-gray-400">
              Chargement des charges...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-100">
              {error}
            </div>
          ) : charges.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-gray-600 dark:text-gray-400">
              <div className="rounded-full bg-primary-50 p-3 text-primary-600 dark:bg-primary-900/30 dark:text-primary-200">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Aucune charge n'a ete enregistree
                </h3>
                <p className="text-sm">
                  Renseignez vos charges fixes pour suivre vos obligations financieres.
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="mt-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Ajouter une charge
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
                      Echeance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {charges.map((charge) => (
                    <tr key={charge.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {charge.description}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {charge.category}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Intl.DateTimeFormat('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }).format(new Date(charge.dueDate))}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(charge.amount)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            charge.isPaid
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}
                        >
                          {charge.isPaid ? 'Payee' : 'A payer'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(charge)}
                            className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                          >
                            <Edit3 className="mr-1.5 h-4 w-4" />
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(charge.id)}
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
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.mode === 'create' ? 'Nouvelle charge' : 'Modifier la charge'}
      >
        <ChargeForm
          onSubmit={handleSaveCharge}
          onCancel={closeModal}
          initialData={modalState.charge}
          isSubmitting={isSubmitting}
          serverError={modalState.error}
        />
      </Modal>
    </>
  );
};

export default Charges;

