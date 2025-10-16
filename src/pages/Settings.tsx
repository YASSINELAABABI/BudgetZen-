import React from 'react';
import Card from '../components/Card.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { Sun, Moon } from 'lucide-react';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card title="Profil Utilisateur">
                <div className="flex items-center space-x-4">
                    <img className="h-20 w-20 rounded-full" src={user?.avatarUrl} alt="User avatar" />
                    <div>
                        <p className="text-xl font-bold text-gray-800 dark:text-white">{user?.name}</p>
                        <p className="text-md text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                </div>
            </Card>

            <Card title="Préférences de l'application">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Thème</span>
                    <button onClick={toggleTheme} className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
                        {theme === 'light' ? 
                            <Moon className="h-6 w-6 text-gray-700" /> : 
                            <Sun className="h-6 w-6 text-yellow-400" />
                        }
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
