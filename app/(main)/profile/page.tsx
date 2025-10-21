"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores/authStore";
import { getProfile, updateProfile, changePassword } from "@/lib/api/auth";
import { User } from "@/lib/types/models";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { UserCircle, Mail, Calendar, Shield, Edit2, Lock } from "lucide-react";
import { 
  profileUpdateSchema, 
  passwordChangeSchema,
  ProfileUpdateFormData,
  PasswordChangeFormData 
} from "@/lib/utils/validation";

export default function ProfilePage() {
  const { user: storeUser, updateUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(storeUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Nickname update form
  const nicknameForm = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      nickname: storeUser?.nickname || '',
    },
  });

  // Password change form
  const passwordForm = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
    },
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProfile();
        if (response.data) {
          setUser(response.data);
          nicknameForm.reset({ nickname: response.data.nickname });
          // Update store with fresh data
          updateUser(response.data);
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Failed to load profile";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [updateUser]);

  // Handle nickname update
  const handleUpdateNickname = async (data: ProfileUpdateFormData) => {
    try {
      await updateProfile(data);
      
      // Update local state and store
      if (user) {
        const updatedUser = { ...user, nickname: data.nickname };
        setUser(updatedUser);
        updateUser({ nickname: data.nickname });
      }
      
      toast.success("Nickname updated successfully");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to update nickname";
      nicknameForm.setError('root', { message: errorMsg });
      toast.error(errorMsg);
    }
  };

  // Handle password change
  const handleChangePassword = async (data: PasswordChangeFormData) => {
    try {
      await changePassword(data);
      
      // Clear password fields
      passwordForm.reset();
      
      toast.success("Password changed successfully");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to change password";
      passwordForm.setError('root', { message: errorMsg });
      toast.error(errorMsg);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <ErrorMessage message={error || "Failed to load profile"} />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and settings
        </p>
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            User Information
          </CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="font-medium">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCircle className="h-4 w-4" />
                <span>Nickname</span>
              </div>
              <p className="font-medium">{user.nickname}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Role</span>
              </div>
              <div>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "Administrator" : "User"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member Since</span>
              </div>
              <p className="font-medium">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Nickname Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Update Nickname
          </CardTitle>
          <CardDescription>Change your display name</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={nicknameForm.handleSubmit(handleUpdateNickname)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-medium">
                New Nickname
              </label>
              <Input
                id="nickname"
                type="text"
                {...nicknameForm.register('nickname')}
                placeholder="Enter new nickname"
                disabled={nicknameForm.formState.isSubmitting}
                aria-invalid={!!nicknameForm.formState.errors.nickname}
                aria-describedby={nicknameForm.formState.errors.nickname ? 'nickname-error' : undefined}
              />
              {nicknameForm.formState.errors.nickname && (
                <p id="nickname-error" className="text-sm text-destructive" role="alert">
                  {nicknameForm.formState.errors.nickname.message}
                </p>
              )}
            </div>
            {nicknameForm.formState.errors.root && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md" role="alert">
                {nicknameForm.formState.errors.root.message}
              </div>
            )}
            <Button 
              type="submit" 
              disabled={nicknameForm.formState.isSubmitting || !nicknameForm.formState.isDirty} 
              className="min-h-[44px]"
            >
              {nicknameForm.formState.isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                "Update Nickname"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="old-password" className="text-sm font-medium">
                Current Password
              </label>
              <Input
                id="old-password"
                type="password"
                {...passwordForm.register('old_password')}
                placeholder="Enter current password"
                disabled={passwordForm.formState.isSubmitting}
                aria-invalid={!!passwordForm.formState.errors.old_password}
                aria-describedby={passwordForm.formState.errors.old_password ? 'old-password-error' : undefined}
              />
              {passwordForm.formState.errors.old_password && (
                <p id="old-password-error" className="text-sm text-destructive" role="alert">
                  {passwordForm.formState.errors.old_password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                {...passwordForm.register('new_password')}
                placeholder="Enter new password (min 6 characters)"
                disabled={passwordForm.formState.isSubmitting}
                aria-invalid={!!passwordForm.formState.errors.new_password}
                aria-describedby={passwordForm.formState.errors.new_password ? 'new-password-error' : undefined}
              />
              {passwordForm.formState.errors.new_password && (
                <p id="new-password-error" className="text-sm text-destructive" role="alert">
                  {passwordForm.formState.errors.new_password.message}
                </p>
              )}
            </div>
            {passwordForm.formState.errors.root && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md" role="alert">
                {passwordForm.formState.errors.root.message}
              </div>
            )}
            <Button type="submit" disabled={passwordForm.formState.isSubmitting} className="min-h-[44px]">
              {passwordForm.formState.isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
