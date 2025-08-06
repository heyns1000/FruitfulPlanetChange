import React from 'react';
import { SimplifiedAccessPortal } from './simplified-access-portal';

export function AccessPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Access Portal
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Sign in to access your personalized Fruitful Global dashboard
          </p>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Quick test: Use email <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">test123@example.com</code>
            </p>
          </div>
        </div>

        <SimplifiedAccessPortal />
      </div>
    </div>
  );
}