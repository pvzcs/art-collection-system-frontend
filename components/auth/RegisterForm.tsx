'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendCode, register } from '@/lib/api/auth';
import { toast } from 'sonner';
import { registerSchema, RegisterFormData } from '@/lib/utils/validation';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { t } = useTranslation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const email = watch('email');

  const handleSendCode = async () => {
    // Validate email field first
    const isEmailValid = await trigger('email');
    if (!isEmailValid) {
      return;
    }

    setIsSendingCode(true);

    try {
      await sendCode(email);
      toast.success(t('auth.codeSent'));
      
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
      const errorMessage = err.response?.data?.message || t('auth.sendCodeFailed');
      setError('email', { message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSendingCode(false);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);

      toast.success(t('auth.registerSuccess') + '! ' + t('auth.loginDescription'));
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t('auth.registerFailed');
      setError('root', { message: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4" aria-label="Registration form">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t('auth.email')}
        </label>
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <Input
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              {...registerField('email')}
              disabled={isSubmitting}
              className="w-full"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : 'email-help'}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={handleSendCode}
            disabled={isSendingCode || countdown > 0 || isSubmitting}
            variant="outline"
            className="shrink-0 min-h-[44px]"
            aria-label={countdown > 0 ? `${t('auth.codeResend')} ${countdown}s` : t('auth.sendingCode')}
          >
            {countdown > 0 ? `${countdown}s` : isSendingCode ? t('auth.sending') : t('auth.sendCode')}
          </Button>
        </div>
        <p id="email-help" className="sr-only">{t('auth.enterEmail')}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="code" className="text-sm font-medium">
          {t('auth.verificationCode')}
        </label>
        <Input
          id="code"
          type="text"
          placeholder={t('auth.codePlaceholder')}
          {...registerField('code')}
          disabled={isSubmitting}
          maxLength={6}
          aria-required="true"
          aria-invalid={!!errors.code}
          aria-describedby={errors.code ? 'code-error' : 'code-help'}
        />
        {errors.code && (
          <p id="code-error" className="text-sm text-destructive" role="alert">
            {errors.code.message}
          </p>
        )}
        <p id="code-help" className="sr-only">{t('auth.enterCode')}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="nickname" className="text-sm font-medium">
          {t('auth.nickname')}
        </label>
        <Input
          id="nickname"
          type="text"
          placeholder={t('auth.nicknamePlaceholder')}
          {...registerField('nickname')}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.nickname}
          aria-describedby={errors.nickname ? 'nickname-error' : undefined}
        />
        {errors.nickname && (
          <p id="nickname-error" className="text-sm text-destructive" role="alert">
            {errors.nickname.message}
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
          placeholder={t('auth.atLeastChars')}
          {...registerField('password')}
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : 'password-help'}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
        <p id="password-help" className="sr-only">{t('auth.passwordMinLength')}</p>
      </div>

      {errors.root && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md" role="alert" aria-live="polite">
          {errors.root.message}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full min-h-[44px]" aria-label={isSubmitting ? t('auth.registering') : t('auth.registerButton')}>
        {isSubmitting ? t('auth.registering') : t('auth.registerButton')}
      </Button>
    </form>
  );
}
