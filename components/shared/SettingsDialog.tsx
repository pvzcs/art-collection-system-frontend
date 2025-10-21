'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettingsStore } from '@/lib/stores/settingsStore';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { apiBaseUrl, setApiBaseUrl, resetApiBaseUrl } = useSettingsStore();
  const [inputValue, setInputValue] = useState(apiBaseUrl);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Update input value when dialog opens or apiBaseUrl changes
  useEffect(() => {
    if (open) {
      setInputValue(apiBaseUrl);
      setError(null);
    }
  }, [open, apiBaseUrl]);

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setError(t('settings.urlRequired'));
      return false;
    }

    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        setError(t('settings.urlProtocol'));
        return false;
      }
      setError(null);
      return true;
    } catch {
      setError(t('settings.invalidUrl'));
      return false;
    }
  };

  const handleSave = () => {
    if (!validateUrl(inputValue)) {
      return;
    }

    try {
      setApiBaseUrl(inputValue);
      toast.success(t('settings.urlUpdated'));
      onOpenChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('errors.generic');
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleReset = () => {
    resetApiBaseUrl();
    setInputValue(useSettingsStore.getState().apiBaseUrl);
    setError(null);
    toast.success(t('settings.urlReset'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('settings.title')}
          </DialogTitle>
          <DialogDescription>
            {t('settings.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="api-url" className="text-sm font-medium leading-none">
              {t('settings.apiBaseUrl')}
            </label>
            <Input
              id="api-url"
              type="url"
              placeholder="http://localhost:8080/api/v1"
              value={inputValue}
              onChange={handleInputChange}
              aria-invalid={!!error}
              aria-describedby={error ? 'url-error' : undefined}
              className="font-mono text-sm"
            />
            {error && (
              <p id="url-error" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="rounded-md bg-muted p-3 space-y-1">
            <p className="text-sm font-medium">{t('settings.currentConfig')}</p>
            <p className="text-xs text-muted-foreground font-mono break-all">
              {apiBaseUrl}
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• URL must start with http:// or https://</p>
            <p>• Changes take effect immediately</p>
            <p>• Default: http://localhost:8080/api/v1</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            {t('settings.resetToDefault')}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
          >
            {t('settings.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
