'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ActivityForm } from '@/components/activities/ActivityForm';
import { Activity } from '@/lib/types/models';
import { ActivityFormData } from '@/lib/types/forms';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';

interface ActivityManagementProps {
  activities: Activity[];
  onCreateActivity: (data: ActivityFormData) => Promise<void>;
  onUpdateActivity: (id: number, data: ActivityFormData) => Promise<void>;
  onDeleteActivity: (id: number) => Promise<void>;
}

export function ActivityManagement({
  activities,
  onCreateActivity,
  onUpdateActivity,
  onDeleteActivity,
}: ActivityManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleCreate = async (data: ActivityFormData) => {
    await onCreateActivity(data);
    setIsCreateDialogOpen(false);
  };

  const handleEdit = async (data: ActivityFormData) => {
    if (selectedActivity) {
      await onUpdateActivity(selectedActivity.id, data);
      setIsEditDialogOpen(false);
      setSelectedActivity(null);
    }
  };

  const handleDelete = async () => {
    if (selectedActivity) {
      await onDeleteActivity(selectedActivity.id);
      setIsDeleteDialogOpen(false);
      setSelectedActivity(null);
    }
  };

  const openEditDialog = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl font-bold">Activity Management</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="min-h-[44px] w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Activity
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Max Uploads</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No activities found. Create your first activity to get started.
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.name}</TableCell>
                  <TableCell>
                    {activity.deadline
                      ? formatDate(activity.deadline)
                      : 'Long-term'}
                  </TableCell>
                  <TableCell>{activity.max_uploads_per_user}</TableCell>
                  <TableCell>{formatDate(activity.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(activity)}
                        title="Edit activity"
                        className="min-h-[44px] min-w-[44px]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => openDeleteDialog(activity)}
                        title="Delete activity"
                        className="min-h-[44px] min-w-[44px]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 border rounded-lg">
            No activities found. Create your first activity to get started.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="border rounded-lg p-4 space-y-3 bg-card"
            >
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{activity.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-sm">
                      {activity.deadline
                        ? formatDate(activity.deadline)
                        : 'Long-term'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Max Uploads</p>
                    <p className="text-sm">{activity.max_uploads_per_user}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">{formatDate(activity.created_at)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 min-h-[44px]"
                  onClick={() => openEditDialog(activity)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 min-h-[44px]"
                  onClick={() => openDeleteDialog(activity)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Activity</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new art collection activity.
            </DialogDescription>
          </DialogHeader>
          <ActivityForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Update the activity details below.
            </DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <ActivityForm
              activity={selectedActivity}
              onSubmit={handleEdit}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedActivity(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedActivity?.name}&quot;? This action
              cannot be undone and will affect all associated artworks.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedActivity(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Activity
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
