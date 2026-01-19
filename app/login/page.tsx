'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

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
              {isLogin ? 'Login to continue your fashion journey' : 'Create an account and get 10% off your first order!'}
            </p>
          </div>

          <form className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <Input placeholder="Jane Doe" className="btn-squishy" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input type="email" placeholder="jane@example.com" className="btn-squishy" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input type="password" placeholder="••••••••" className="btn-squishy" />
            </div>

            {isLogin && (
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              data-sound="whoop"
              type="submit"
              className="w-full btn-squishy bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isLogin ? '🚀 Login' : '✨ Create Account'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t">
            <p className="text-center text-sm text-foreground/60 mb-4">Or continue with</p>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="btn-squishy" data-sound="tap">
                🔵 Facebook
              </Button>
              <Button variant="outline" className="btn-squishy" data-sound="tap">
                🟣 Google
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
