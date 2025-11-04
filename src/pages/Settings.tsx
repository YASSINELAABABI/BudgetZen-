import React from 'react';
import { Sun, Moon, ShieldCheck, Mail, User, Smartphone } from 'lucide-react';
import Card from '../components/Card.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

const Settings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Card title="Profil utilisateur">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-primary-100 dark:border-primary-900/50">
            <img
              className="h-full w-full object-cover"
              src={
                user?.avatarUrl ??
                (user?.email
                  ? `https://www.gravatar.com/avatar/${btoa(user.email)}?d=identicon`
                  : 'https://www.gravatar.com/avatar/?d=mp')
              }
              alt="Avatar utilisateur"
            />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">{user?.name ?? 'Utilisateur'}</p>
            <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              {user?.email ?? 'Non renseigne'}
            </p>
            <button
              onClick={refreshUser}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <ShieldCheck className="h-4 w-4" />
              Verifier les informations
            </button>
          </div>
        </div>
      </Card>

      <Card title="Preferences d affichage">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-50">Theme</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Passez du theme clair au theme sombre selon vos habitudes.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-4 w-4" />
                  Mode sombre
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  Mode clair
                </>
              )}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-100 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
              <User className="mb-3 h-5 w-5 text-primary-500" />
              <p className="font-semibold text-gray-900 dark:text-gray-100">Profils multiples</p>
              <p>Ajoutez prochainement des membres pour partager la gestion du budget.</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
              <Smartphone className="mb-3 h-5 w-5 text-primary-500" />
              <p className="font-semibold text-gray-900 dark:text-gray-100">Notifications mobiles</p>
              <p>Recevez des alertes de paiement directement sur votre appareil.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;

