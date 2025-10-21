import { z } from 'zod';

// Login form validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register form validation
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  code: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .min(2, 'Nickname must be at least 2 characters')
    .max(50, 'Nickname must not exceed 50 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Profile update validation
export const profileUpdateSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .min(2, 'Nickname must be at least 2 characters')
    .max(50, 'Nickname must not exceed 50 characters'),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// Password change validation
export const passwordChangeSchema = z.object({
  old_password: z
    .string()
    .min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(1, 'New password is required')
    .min(6, 'New password must be at least 6 characters')
    .max(100, 'New password must not exceed 100 characters'),
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// Activity form validation
export const activitySchema = z.object({
  name: z
    .string()
    .min(1, 'Activity name is required')
    .min(3, 'Activity name must be at least 3 characters')
    .max(100, 'Activity name must not exceed 100 characters'),
  deadline: z
    .string()
    .nullable(),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  max_uploads_per_user: z
    .number()
    .min(1, 'Maximum uploads must be at least 1')
    .max(100, 'Maximum uploads must not exceed 100')
    .int('Maximum uploads must be a whole number'),
});

export type ActivityFormData = z.infer<typeof activitySchema>;

// Artwork upload validation (file validation done separately)
export const artworkUploadSchema = z.object({
  activity_id: z
    .number()
    .min(1, 'Activity ID is required'),
});

export type ArtworkUploadFormData = z.infer<typeof artworkUploadSchema>;

// File validation helper
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must not exceed 10MB',
    };
  }

  return { valid: true };
};
