import React, { useState } from 'react';
import { useData } from '../context/DataContext.tsx';
import Card from '../components/Card.tsx';
import Modal from '../components/Modal.tsx';
import ExpenseForm from '../components/ExpenseForm.tsx';
import { Expense } from '../types/index.ts';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Expenses: React.FC = () => {
    const { expenses, addExpense, updateExpense, deleteExpense } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const handleOpenAddModal = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (expense: Expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingExpense(null);
    };

    const handleSaveExpense = (expenseData: Omit<Expense, 'id'> | Expense) => {
        if ('id' in expenseData) {
            updateExpense(expenseData);
        } else {
            addExpense(expenseData);
        }
        handleCloseModal();
    };
    
    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Gestion des Dépenses</h2>
                    <button onClick={handleOpenAddModal} className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700">
                        <Plus className="h-5 w-5 mr-2" />
                        Ajouter une Dépense
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Montant</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Catégorie</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {expenses.map(expense => (
                            <tr key={expense.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{expense.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${expense.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{expense.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{expense.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => handleOpenEditModal(expense)} className="text-primary-600 hover:text-primary-900"><Edit className="h-5 w-5"/></button>
                                    <button onClick={() => deleteExpense(expense.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5"/></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingExpense ? 'Modifier la Dépense' : 'Ajouter une Dépense'}>
                <ExpenseForm 
                    onSubmit={handleSaveExpense} 
                    onCancel={handleCloseModal} 
                    initialData={editingExpense} 
                />
            </Modal>
        </>
    );
};

export default Expenses;
