'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Activity } from '@/lib/types/models';
import { activitySchema, ActivityFormData } from '@/lib/utils/validation';

interface ActivityFormProps {
  activity?: Activity;
  onSubmit: (data: ActivityFormData) => Promise<void>;
  onCancel: () => void;
}

export function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const [hasNoDeadline, setHasNoDeadline] = useState(!activity?.deadline);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: activity?.name || '',
      deadline: activity?.deadline ? activity.deadline.split('T')[0] : null,
      description: activity?.description || '',
      max_uploads_per_user: activity?.max_uploads_per_user || 1,
    },
  });

  // Update hasNoDeadline when activity changes
  useEffect(() => {
    if (activity) {
      setHasNoDeadline(!activity.deadline);
    }
  }, [activity]);

  const handleSubmit = async (data: ActivityFormData) => {
    try {
      const formData: ActivityFormData = {
        ...data,
        deadline: hasNoDeadline ? null : data.deadline,
      };

      await onSubmit(formData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to save activity';
      setError('root', { message: errorMessage });
    }
  };

  return (
    <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Activity Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Enter activity name"
          {...register('name')}
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="deadline" className="text-sm font-medium">
          Deadline
        </label>
        <Input
          id="deadline"
          type="date"
          {...register('deadline')}
          disabled={isSubmitting || hasNoDeadline}
          min={new Date().toISOString().split('T')[0]}
          aria-invalid={!!errors.deadline}
          aria-describedby={errors.deadline ? 'deadline-error' : undefined}
        />
        {errors.deadline && (
          <p id="deadline-error" className="text-sm text-destructive" role="alert">
            {errors.deadline.message}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Checkbox
            id="no-deadline"
            checked={hasNoDeadline}
            onCheckedChange={(checked) => {
              setHasNoDeadline(checked as boolean);
              if (checked) {
                setValue('deadline', null);
              }
            }}
            disabled={isSubmitting}
          />
          <label
            htmlFor="no-deadline"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            No deadline (Long-term activity)
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="max-uploads" className="text-sm font-medium">
          Max Uploads Per User <span className="text-destructive">*</span>
        </label>
        <Input
          id="max-uploads"
          type="number"
          min="1"
          placeholder="Enter max uploads"
          {...register('max_uploads_per_user', { valueAsNumber: true })}
          disabled={isSubmitting}
          aria-invalid={!!errors.max_uploads_per_user}
          aria-describedby={errors.max_uploads_per_user ? 'max-uploads-error' : undefined}
        />
        {errors.max_uploads_per_user && (
          <p id="max-uploads-error" className="text-sm text-destructive" role="alert">
            {errors.max_uploads_per_user.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          placeholder="Enter activity description (Markdown supported)"
          {...register('description')}
          disabled={isSubmitting}
          rows={8}
          className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-y"
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : 'description-help'}
        />
        {errors.description && (
          <p id="description-error" className="text-sm text-destructive" role="alert">
            {errors.description.message}
          </p>
        )}
        <p id="description-help" className="text-xs text-muted-foreground">
          You can use Markdown formatting for the description
        </p>
      </div>

      {errors.root && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md" role="alert">
          {errors.root.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="min-h-[44px] w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-h-[44px] w-full sm:w-auto">
          {isSubmitting ? 'Saving...' : activity ? 'Update Activity' : 'Create Activity'}
        </Button>
      </div>
    </form>
  );
}
