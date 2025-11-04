import React, { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, CalendarClock, CreditCard, TrendingUp } from 'lucide-react';
import Card from '../components/Card.tsx';
import { useData } from '../context/DataContext.tsx';

const Dashboard: React.FC = () => {
  const { expenses, charges, isLoading, error } = useData();

  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalCharges = charges.reduce((sum, charge) => sum + charge.amount, 0);
    const remainingBudget = Math.max(0, 5000 - (totalExpenses + totalCharges)); // Placeholder income

    const trendData = [...expenses]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7)
      .map((expense) => ({
        name: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(new Date(expense.date)),
        montant: expense.amount,
      }));

    const upcomingCharges = charges
      .filter((charge) => !charge.isPaid)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);

    const recentTransactions = [...expenses, ...charges]
      .sort((a, b) => {
        const dateA = 'date' in a ? a.date : a.dueDate;
        const dateB = 'date' in b ? b.date : b.dueDate;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      })
      .slice(0, 6);

    return {
      totalExpenses,
      totalCharges,
      remainingBudget,
      trendData,
      upcomingCharges,
      recentTransactions,
    };
  }, [expenses, charges]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Vue d ensemble</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Suivez vos depenses, vos charges et vos transactions en un coup d oeil.
          </p>
        </div>
        <div className="rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 dark:border-primary-900 dark:bg-primary-900/20 dark:text-primary-200">
          {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total depenses</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-50">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalExpenses)}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-300">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              4.2% vs mois dernier
            </span>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Charges prevues</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-50">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalCharges)}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300">
              <CalendarClock className="mr-1 h-4 w-4" />
              {charges.filter((charge) => !charge.isPaid).length} a venir
            </span>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget restant</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-50">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.remainingBudget)}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600 dark:bg-green-900/30 dark:text-green-300">
              <TrendingUp className="mr-1 h-4 w-4" />
              Objectif 5k
            </span>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Tendance des depenses</h2>
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              7 derniers jours
            </span>
          </div>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-gray-600 dark:text-gray-400">
              Chargement du graphique...
            </div>
          ) : stats.trendData.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              Enregistrez des depenses pour visualiser vos tendances.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={stats.trendData}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="fill-transparent stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" stroke="currentColor" className="text-xs text-gray-500 dark:text-gray-400" />
                <YAxis stroke="currentColor" className="text-xs text-gray-500 dark:text-gray-400" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgb(17 24 39)', border: 'none', borderRadius: '0.75rem' }}
                  labelStyle={{ color: 'rgb(209 213 219)' }}
                  itemStyle={{ color: 'rgb(96 165 250)' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="montant"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSpend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Charges imminentes</h2>
            <CreditCard className="h-5 w-5 text-primary-500" />
          </div>
          {isLoading ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">Chargement des charges...</p>
          ) : stats.upcomingCharges.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aucune charge a venir. Ajoutez vos prochaines echeances pour rester a jour.
            </p>
          ) : (
            <ul className="space-y-3">
              {stats.upcomingCharges.map((charge) => (
                <li
                  key={charge.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{charge.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Intl.DateTimeFormat('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                      }).format(new Date(charge.dueDate))}{' '}
                      · {charge.category}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(charge.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">Transactions recentes</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-600 dark:text-gray-400">
            Chargement des transactions...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-100">
            {error}
          </div>
        ) : stats.recentTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-gray-600 dark:text-gray-400">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Enregistrez vos premieres transactions
            </p>
            <p className="text-sm">
              Chaque depense ou charge saisie apparaitra ici pour un suivi rapide.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border border-gray-100 shadow-sm dark:border-gray-700 dark:shadow-lg">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                    Libelle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {stats.recentTransactions.map((transaction) => {
                  const isExpense = 'date' in transaction;
                  const dateValue = isExpense ? transaction.date : transaction.dueDate;
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            isExpense
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}
                        >
                          {isExpense ? 'Depense' : 'Charge'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Intl.DateTimeFormat('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }).format(new Date(dateValue))}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                          transaction.amount
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
