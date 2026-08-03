import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-3">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-8">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-100 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
};
