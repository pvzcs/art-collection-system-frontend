/**
 * Login form data
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Registration form data
 */
export interface RegisterFormData {
  email: string;
  code: string;
  password: string;
  nickname: string;
}

/**
 * Activity form data for create/update operations
 */
export interface ActivityFormData {
  name: string;
  deadline: string | null;
  description: string;
  max_uploads_per_user: number;
}

/**
 * Profile update form data
 */
export interface ProfileUpdateData {
  nickname: string;
}

/**
 * Password change form data
 */
export interface PasswordChangeData {
  old_password: string;
  new_password: string;
}

/**
 * Artwork upload form data
 */
export interface ArtworkUploadData {
  activity_id: number;
  file: File;
}

/**
 * User role update data
 */
export interface UserRoleUpdateData {
  role: 'user' | 'admin';
}

/**
 * Artwork review data
 */
export interface ArtworkReviewData {
  approved: boolean;
}

/**
 * Batch artwork review data
 */
export interface BatchArtworkReviewData {
  artwork_ids: number[];
  approved: boolean;
}
