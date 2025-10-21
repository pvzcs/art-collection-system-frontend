'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { toast } from 'sonner';
import { loginSchema, LoginFormData } from '@/lib/utils/validation';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      
      if (response.data) {
        // Store auth data in Zustand store
        setAuth(response.data.token, response.data.user);
        
        toast.success(t('auth.loginSuccess'));
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t('auth.loginFailed');
      setError('root', { message: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4" aria-label="Login form">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t('auth.email')}
        </label>
        <Input
          id="email"
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          {...register('email')}
          disabled={isSubmitting}
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          {t('auth.password')}
        </label>
        <Input
          id="password"
          type="password"
          placeholder={t('auth.passwordPlaceholder')}
          {...register('password')}
          disabled={isSubmitting}
          autoComplete="current-password"
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md" role="alert" aria-live="polite">
          {errors.root.message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full min-h-[44px]" aria-label={isSubmitting ? t('auth.loggingIn') : t('auth.loginButton')}>
        {isSubmitting ? t('auth.loggingIn') : t('auth.loginButton')}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {t('auth.noAccount')}{' '}
        <Link href="/register" className="text-primary hover:underline font-medium">
          {t('auth.registerHere')}
        </Link>
      </div>
    </form>
  );
}
