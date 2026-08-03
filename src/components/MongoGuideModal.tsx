import React, { useState, useEffect } from 'react';
import { Database, X, CheckCircle, ExternalLink, ShieldAlert, Key, Copy, Check } from 'lucide-react';

interface MongoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MongoGuideModal: React.FC<MongoGuideModalProps> = ({ isOpen, onClose }) => {
  const [dbStatus, setDbStatus] = useState<{ isUsingMemoryDb: boolean; type: string; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/db-status')
        .then((res) => res.json())
        .then((data) => setDbStatus(data))
        .catch(() => setDbStatus(null));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sampleUri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmaster?retryWrites=true&w=majority';

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">MongoDB Atlas Setup Guide</h2>
              <p className="text-xs text-slate-500">How to connect a free cloud MongoDB database to TaskMaster</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator Banner */}
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Database Mode</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${dbStatus?.isUsingMemoryDb ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="font-semibold text-slate-800 text-sm">
                  {dbStatus ? dbStatus.type : 'In-Memory Preview Mode'}
                </span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              dbStatus?.isUsingMemoryDb ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {dbStatus?.isUsingMemoryDb ? 'Preview Fallback Active' : 'Connected to Atlas'}
            </span>
          </div>

          {/* Setup Steps */}
          <div className="space-y-4 text-sm text-slate-700">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>Step-by-Step Instructions</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
                  <span>Create a Free MongoDB Atlas Account</span>
                </div>
                <p className="text-xs text-slate-600 pl-7">
                  Go to <a href="https://www.mongodb.com/cloud/atlas/register" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5">MongoDB Atlas <ExternalLink className="w-3 h-3" /></a> and create a free M0 cluster.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
                  <span>Create Database User & Password</span>
                </div>
                <p className="text-xs text-slate-600 pl-7">
                  In Atlas Security Settings, navigate to <strong>Database Access</strong> and click <strong>Add New Database User</strong>. Note down your username and password.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-amber-50/50 border-amber-200 shadow-2xs space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">3</span>
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Configure Network Access (Whitelist IP)</span>
                  </span>
                </div>
                <p className="text-xs text-slate-700 pl-7">
                  In Atlas Security Settings, go to <strong>Network Access</strong> → <strong>Add IP Address</strong> → Click <strong>ALLOW ACCESS FROM ANYWHERE</strong> (<code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900">0.0.0.0/0</code>). This allows your Cloud Run applet environment to connect.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">4</span>
                  <span>Copy Connection String</span>
                </div>
                <p className="text-xs text-slate-600 pl-7">
                  In Database Overview, click <strong>Connect</strong> → <strong>Drivers</strong> → Copy connection string:
                </p>
                <div className="mt-2 ml-7 p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs flex items-center justify-between gap-2 overflow-x-auto">
                  <span className="truncate">{sampleUri}</span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0"
                    title="Copy URI Format"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">5</span>
                  <span>Set MONGODB_URI in App Settings</span>
                </div>
                <p className="text-xs text-slate-600 pl-7">
                  Replace <code className="bg-slate-100 px-1 py-0.5 rounded">&lt;username&gt;</code> and <code className="bg-slate-100 px-1 py-0.5 rounded">&lt;password&gt;</code> with your actual credentials, then set <code className="bg-slate-100 px-1 py-0.5 rounded">MONGODB_URI</code> in project settings!
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
