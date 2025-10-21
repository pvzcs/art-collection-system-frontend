'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserManagement } from '@/components/admin/UserManagement';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { User } from '@/lib/types/models';
import { getUsers, updateUserRole } from '@/lib/api/admin';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    page_size: 20,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUsers({ page, page_size: 20 });
      
      if (response.data) {
        setUsers(response.data.users);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          page_size: response.data.page_size,
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleRoleChange = async (userId: number, role: 'user' | 'admin') => {
    await updateUserRole(userId, role);
    
    // Update the user in the list
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, role, updated_at: new Date().toISOString() }
        : user
    ));
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and roles
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage
            title="Failed to Load Users"
            message={error}
            variant="card"
            onRetry={() => fetchUsers(pagination.page)}
          />
        ) : (
          <UserManagement
            users={users}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRoleChange={handleRoleChange}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
