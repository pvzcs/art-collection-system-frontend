'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function LoginPage() {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('auth.loginTitle')}</CardTitle>
        <CardDescription>
          {t('auth.loginDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
