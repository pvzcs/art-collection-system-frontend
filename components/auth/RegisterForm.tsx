'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendCode, register } from '@/lib/api/auth';
import { toast } from 'sonner';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSendingCode(true);
    setError('');

    try {
      await sendCode(email);
      toast.success('Verification code sent to your email');
      
      // Start countdown timer (60 seconds)
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send verification code';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !code || !password || !nickname) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email,
        code,
        password,
        nickname,
      });

      toast.success('Registration successful! Please log in.');
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleSendCode}
            disabled={isSendingCode || countdown > 0 || isLoading}
            variant="outline"
            className="shrink-0"
          >
            {countdown > 0 ? `${countdown}s` : isSendingCode ? 'Sending...' : 'Send Code'}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="code" className="text-sm font-medium">
          Verification Code
        </label>
        <Input
          id="code"
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isLoading}
          required
          maxLength={6}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="nickname" className="text-sm font-medium">
          Nickname
        </label>
        <Input
          id="nickname"
          type="text"
          placeholder="Your display name"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          minLength={6}
        />
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
}
