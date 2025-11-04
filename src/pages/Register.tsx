import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Les deux mots de passe doivent etre identiques.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        passwordConfirmation: confirmPassword,
      });
      navigate('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Inscription impossible pour le moment. Merci de reessayer.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="flex items-center space-x-3 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-700 dark:border-primary-900 dark:bg-primary-900/20 dark:text-primary-200">
        <Shield className="h-5 w-5 flex-shrink-0" />
        <p>
          Creez un espace personnel pour suivre vos depenses et charges en temps reel.
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Nom complet
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 dark:focus:border-primary-400"
            placeholder="Nom et prenom"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Adresse email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 dark:focus:border-primary-400"
            placeholder="vous@example.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 dark:focus:border-primary-400"
            placeholder="Minimum 8 caracteres"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Confirmez le mot de passe
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-50 dark:focus:border-primary-400"
            placeholder="Repetez le mot de passe"
          />
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-start rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
          <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900"
        >
          {loading ? 'Creation du compte...' : 'Creer mon compte'}
        </button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Deja inscrit ?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Se connecter
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Register;
