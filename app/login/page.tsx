'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        router.push('/');
        router.refresh();
      } else {
        // Signup
        const { error: signUpError, data } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (signUpError) throw signUpError;

        // Create user profile
        if (data.user) {
          await supabase.from('user_profiles').insert([
            {
              id: data.user.id,
              email: formData.email,
              full_name: formData.fullName,
            },
          ]);
        }

        setError('Check your email to confirm your account!');
        setTimeout(() => {
          setIsLogin(true);
          setError('');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 product-card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isLogin ? '✨ Welcome Back!' : '🎉 Join Bagsberry'}
            </h1>
            <p className="text-foreground/70">
              {isLogin
                ? 'Login to continue your fashion journey'
                : 'Create an account and get 10% off your first order!'}
            </p>
          </div>

          {error && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                error.includes('email')
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-destructive/10 text-destructive border border-destructive'
              }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Jane Doe"
                  className="btn-squishy"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="jane@example.com"
                className="btn-squishy"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="btn-squishy"
                required
                minLength={6}
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              data-sound="whoop"
              type="submit"
              className="w-full btn-squishy bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : isLogin
                  ? '🚀 Login'
                  : '✨ Create Account'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Login'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t">
            <p className="text-center text-sm text-foreground/60 mb-4">
              Or continue with
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="btn-squishy"
                data-sound="tap"
                onClick={() => handleOAuthLogin('google')}
                type="button"
              >
                🟣 Google
              </Button>
              <Button
                variant="outline"
                className="btn-squishy"
                data-sound="tap"
                onClick={() => handleOAuthLogin('facebook')}
                type="button"
              >
                🔵 Facebook
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
