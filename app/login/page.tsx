'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      await login(data.email, data.password);
      router.push('/admin');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Invalid email or password';

      if (
        message.toLowerCase().includes('locked') ||
        message.toLowerCase().includes('temporarily')
      ) {
        setServerError(message);
      } else {
        setServerError('Invalid email or password');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {serverError && (
        <div
          className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700"
          role="alert"
        >
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-navy-800 mb-1.5"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className={`block w-full rounded-xl border-2 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all duration-200 sm:text-sm ${
            errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-navy-800 mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          className={`block w-full rounded-xl border-2 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all duration-200 sm:text-sm ${
            errors.password ? 'border-red-400 bg-red-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="mt-1.5 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full justify-center rounded-xl bg-gradient-gold px-4 py-3.5 text-sm font-bold text-navy-900 shadow-glow hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 min-h-[44px]"
      >
        {isSubmitting ? 'Signing in...' : 'Login'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative items-center justify-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-navy-400/20 rounded-full blur-3xl animate-float [animation-delay:3s]" />

        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center mx-auto shadow-glow mb-8">
            <img className="rounded-full" src="/pcc-logo.png" alt="PCC Logo"/>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Admin Portal
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Sign in to manage church content — announcements, events, sermons, and News sources.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gold-400" />
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <div className="w-3 h-3 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-warm-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo - shown only on smaller screens */}
          <div className="lg:hidden text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mx-auto shadow-glow mb-4">
              <img className="rounded-full" src="/pcc-logo.png" alt="PCC Logo"/>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-navy-900">
              Admin Sign In
            </h1>
            <p className="mt-2 text-gray-600">
              PC Kumba-Mbeng administrator access
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
