// Form data types

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  code: string;
  password: string;
  nickname: string;
}

export interface ActivityFormData {
  name: string;
  deadline: string | null;
  description: string;
  max_uploads_per_user: number;
}

export interface ProfileUpdateData {
  nickname: string;
}

export interface PasswordChangeData {
  old_password: string;
  new_password: string;
}
