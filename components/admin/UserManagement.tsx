'use client';

import { useState } from 'react';
import { User } from '@/lib/types/models';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/shared/Pagination';
import { formatDate } from '@/lib/utils/formatters';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface UserManagementProps {
  users: User[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
  };
  onPageChange: (page: number) => void;
  onRoleChange: (userId: number, role: 'user' | 'admin') => Promise<void>;
}

export function UserManagement({
  users,
  pagination,
  onPageChange,
  onRoleChange,
}: UserManagementProps) {
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const totalPages = Math.ceil(pagination.total / pagination.page_size);

  const handleRoleChange = async (userId: number, newRole: 'user' | 'admin') => {
    try {
      setUpdatingUserId(userId);
      await onRoleChange(userId, newRole);
      toast.success('User role updated successfully');
    } catch (error: any) {
      console.error('Failed to update user role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.nickname}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value) =>
                      handleRoleChange(user.id, value as 'user' | 'admin')
                    }
                    disabled={updatingUserId === user.id}
                  >
                    <SelectTrigger className="w-[120px] min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[44px]"
                    asChild
                  >
                    <Link href={`/users/${user.id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Space
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded-lg p-4 space-y-3 bg-card"
          >
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium break-all">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nickname</p>
                <p className="font-medium">{user.nickname}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Registered</p>
                <p className="text-sm">{formatDate(user.created_at)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Role</p>
              <Select
                value={user.role}
                onValueChange={(value) =>
                  handleRoleChange(user.id, value as 'user' | 'admin')
                }
                disabled={updatingUserId === user.id}
              >
                <SelectTrigger className="w-full min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full min-h-[44px]"
              asChild
            >
              <Link href={`/users/${user.id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Space
              </Link>
            </Button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-6"
        />
      )}
    </div>
  );
}
