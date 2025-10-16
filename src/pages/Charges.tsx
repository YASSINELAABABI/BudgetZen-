import React from 'react';
import { useData } from '../context/DataContext.tsx';
import Card from '../components/Card.tsx';
import { Charge } from '../types/index.ts';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Charges: React.FC = () => {
    const { charges, deleteCharge, addCharge } = useData();
    
    const handleAdd = () => {
        // Mock add
        const newCharge: Omit<Charge, 'id'> = {
            description: 'New Sample Charge',
            amount: Math.floor(Math.random() * 500),
            category: 'Utilities',
            dueDate: new Date().toISOString().split('T')[0],
            isPaid: false,
        };
        addCharge(newCharge);
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Gestion des Charges</h2>
                <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700">
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter une Charge
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Montant</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date d'échéance</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {charges.map(charge => (
                        <tr key={charge.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{charge.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${charge.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{charge.dueDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${charge.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {charge.isPaid ? 'Payé' : 'Non Payé'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button className="text-primary-600 hover:text-primary-900"><Edit className="h-5 w-5"/></button>
                                <button onClick={() => deleteCharge(charge.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5"/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default Charges;
