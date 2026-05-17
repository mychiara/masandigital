'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { auth } from '../../lib/auth';
import { db } from '../../lib/db';
import { LogIn, UserPlus, AlertCircle, Sparkles, Key, Check } from 'lucide-react';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const session = auth.getCurrentUser();
    if (session) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (activeTab === 'signin') {
        const user = await auth.login(email, password);
        setSuccess(`Welcome back, ${user.name}! Redirecting to dashboard...`);
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 1500);
      } else {
        const user = await auth.signup(name, email, password);
        setSuccess(`Account created for ${user.name}! Access granted...`);
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadPresetDemo = () => {
    setEmail('admin@masandigital.com');
    setPassword('admin123');
    setActiveTab('signin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-40 pb-16 px-6 relative">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl -z-10 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-secondary/10 blur-3xl -z-10"></div>

        <div className="w-full max-w-md bg-surface-container-lowest/80 border border-outline-variant/30 backdrop-blur-md rounded-3xl p-8 shadow-xl">
          
          {/* Brand Header */}
          <div className="text-center mb-8">
            <span className="font-extrabold text-2xl tracking-tighter brand-gradient-text">
              masandigital.com
            </span>
            <p className="text-xs text-on-surface-variant mt-2 font-medium">
              Editorial CMS & Author Portal
            </p>
          </div>

          {/* Toggle Tabs or Secure Locked Header */}
          {!db.isSupabase ? (
            <>
              <div className="flex bg-surface-container-low p-1.5 rounded-full mb-6 border border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'signin'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'signup'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Create Account
                </button>
              </div>

              {/* Preset Demo Shortcut */}
              {activeTab === 'signin' && (
                <button
                  type="button"
                  onClick={loadPresetDemo}
                  className="w-full py-2.5 px-4 mb-6 rounded-xl border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  Click here to Autofill Demo Credentials
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-3 mb-6 bg-primary/5 rounded-2xl border border-primary/15 text-primary font-bold text-xs flex items-center justify-center gap-1.5">
              <Key className="w-4 h-4 animate-bounce" />
              Secure Enterprise Administrator Portal
            </div>
          )}

          {/* Error and Success Alerts */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl flex items-start gap-2 mb-6 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-xl flex items-start gap-2 mb-6 text-xs leading-relaxed">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Andy Masan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-outline-variant/30 rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@masandigital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-outline-variant/30 rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-outline-variant/30 rounded-xl py-3 px-4 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl text-xs hover:opacity-90 shadow-md transition-opacity flex items-center justify-center gap-1.5 mt-6 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : activeTab === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In to Dashboard
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Register Account
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
