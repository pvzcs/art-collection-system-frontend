'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, Image as ImageIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/stores/authStore';
import { getActivities } from '@/lib/api/activities';
import { Activity } from '@/lib/types/models';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivities({ page: 1, page_size: 3 });
        if (response.data) {
          setActivities(response.data.activities);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold tracking-tight">
          {t('home.heroTitle')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {isAuthenticated
            ? t('home.heroDescriptionAuth').replace('{nickname}', user?.nickname || '')
            : t('home.heroDescriptionGuest')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {isAuthenticated ? (
            <>
              <Button size="lg" onClick={() => router.push('/activities')} className="min-h-[44px]" aria-label={t('home.browseActivities')}>
                {t('home.browseActivities')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/profile')} className="min-h-[44px]" aria-label={t('home.myProfile')}>
                {t('home.myProfile')}
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" onClick={() => router.push('/register')} className="min-h-[44px]" aria-label={t('home.getStarted')}>
                {t('home.getStarted')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/login')} className="min-h-[44px]" aria-label={t('home.login')}>
                {t('home.login')}
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">{t('home.featuresTitle')}</h2>
        <Card>
          <CardHeader>
            <Calendar className="h-10 w-10 text-primary mb-2" aria-hidden="true" />
            <CardTitle>{t('home.artActivitiesTitle')}</CardTitle>
            <CardDescription>
              {t('home.artActivitiesDesc')}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <ImageIcon className="h-10 w-10 text-primary mb-2" aria-hidden="true" />
            <CardTitle>{t('home.shareArtTitle')}</CardTitle>
            <CardDescription>
              {t('home.shareArtDesc')}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-2" aria-hidden="true" />
            <CardTitle>{t('home.personalSpaceTitle')}</CardTitle>
            <CardDescription>
              {t('home.personalSpaceDesc')}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Recent Activities Section */}
      <section className="space-y-4" aria-labelledby="recent-activities-heading">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 id="recent-activities-heading" className="text-2xl font-bold">{t('home.recentActivitiesTitle')}</h2>
            <p className="text-muted-foreground">
              {t('home.recentActivitiesDesc')}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/activities')} className="min-h-[44px] w-full sm:w-auto" aria-label={t('home.viewAll')}>
            {t('home.viewAll')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : activities.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6" role="list">
            {activities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow" role="listitem">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{activity.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {activity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      {activity.deadline ? (
                        <span>{t('home.deadline')}: {new Date(activity.deadline).toLocaleDateString()}</span>
                      ) : (
                        <span>{t('home.longTermActivity')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" aria-hidden="true" />
                      <span>{t('home.maxUploads').replace('{count}', activity.max_uploads_per_user.toString())}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4 min-h-[44px]"
                    variant="outline"
                    onClick={() => router.push(`/activities/${activity.id}`)}
                    aria-label={`${t('home.viewDetails')} - ${activity.name}`}
                  >
                    {t('home.viewDetails')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center" role="status">
              <p className="text-muted-foreground">{t('home.noActivities')}</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="text-center py-12 space-y-4" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="text-3xl font-bold">{t('home.ctaTitle')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('home.ctaDesc')}
          </p>
          <Button size="lg" onClick={() => router.push('/register')} className="min-h-[44px]" aria-label={t('home.createAccount')}>
            {t('home.createAccount')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </section>
      )}
    </div>
  );
}
