import React from 'react';
import { useData } from '../context/DataContext.tsx';
import Card from '../components/Card.tsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { expenses, charges } = useData();

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalCharges = charges.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = 5000; // Mock income

  const expenseData = expenses.slice(0, 5).map(e => ({ name: e.description, amount: e.amount }));
  
  const chargeCategoryData = charges.reduce((acc, charge) => {
    const existing = acc.find(item => item.name === charge.category);
    if (existing) {
      existing.value += charge.amount;
    } else {
      acc.push({ name: charge.category, value: charge.amount });
    }
    return acc;
  }, [] as {name: string, value: number}[]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const recentTransactions = [...expenses, ...charges]
    // FIX: Use a type guard ('in' operator) to safely access date properties on the union type.
    .sort((a, b) => {
      const dateA = 'date' in a ? a.date : a.dueDate;
      const dateB = 'date' in b ? b.date : b.dueDate;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
                    <DollarSign className="h-6 w-6 text-green-500 dark:text-green-300"/>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">${totalIncome.toFixed(2)}</p>
                </div>
            </div>
        </Card>
        <Card>
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-800">
                    <TrendingDown className="h-6 w-6 text-red-500 dark:text-red-300"/>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">${totalExpenses.toFixed(2)}</p>
                </div>
            </div>
        </Card>
        <Card>
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-800">
                    <TrendingUp className="h-6 w-6 text-yellow-500 dark:text-yellow-300"/>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Charges</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">${totalCharges.toFixed(2)}</p>
                </div>
            </div>
        </Card>
        <Card>
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800">
                    <Clock className="h-6 w-6 text-blue-500 dark:text-blue-300"/>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">${(totalIncome - totalExpenses).toFixed(2)}</p>
                </div>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Expenses Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseData}>
              <XAxis dataKey="name" stroke="rgb(107 114 128)" />
              <YAxis stroke="rgb(107 114 128)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgb(31 41 55)', border: 'none' }}/>
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Charges by Category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chargeCategoryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label>
                {chargeCategoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgb(31 41 55)', border: 'none' }}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Recent Transactions">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map(tx => (
                <tr key={tx.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{tx.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${tx.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{'date' in tx ? tx.date : tx.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${'date' in tx ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {'date' in tx ? 'Expense' : 'Charge'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
