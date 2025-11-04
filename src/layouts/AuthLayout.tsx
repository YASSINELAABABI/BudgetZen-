import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4 py-12 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl backdrop-blur dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="relative hidden bg-primary-600 p-10 text-white lg:flex lg:flex-col">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-8 w-8" />
              <span className="text-2xl font-semibold">BudgetZen</span>
            </div>
            <div className="mt-16 space-y-4">
              <h1 className="text-3xl font-bold leading-tight">
                Maitrisez vos finances avec une vision claire et inspiree.
              </h1>
              <p className="text-sm text-primary-100">
                Suivez vos depenses, planifiez vos charges et gardez une longueur d avance sur votre budget
                personnel ou familial.
              </p>
            </div>
            <div className="mt-auto rounded-2xl bg-white/10 p-6 text-primary-100 backdrop-blur">
              <p className="text-sm font-medium">BudgetZen simplifie votre quotidien financier :</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>- Visualisez vos depenses en temps reel</li>
                <li>- Recevez des rappels pour vos charges a venir</li>
                <li>- Activez le mode sombre pour travailler a toute heure</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col space-y-8 p-8 sm:p-10">
            <div className="flex items-center gap-3 text-primary-600 lg:hidden">
              <ShieldCheck className="h-8 w-8" />
              <span className="text-2xl font-semibold">BudgetZen</span>
            </div>
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

