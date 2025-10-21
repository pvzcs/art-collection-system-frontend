"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { getUserArtworks, deleteArtwork } from "@/lib/api/artworks";
import { Artwork } from "@/lib/types/models";
import { ArtworkList } from "@/components/artworks/ArtworkList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { UserCircle, ImageIcon, CheckCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UserPersonalSpacePage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.id as string);
  const { user: currentUser, isAdmin } = useAuthStore();

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArtworks, setTotalArtworks] = useState(0);
  const [pageSize] = useState(20);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Check if current user can access this page
  const isOwnSpace = currentUser?.id === userId;
  const canAccess = isOwnSpace || isAdmin;

  // Fetch artworks
  const fetchArtworks = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      const response = await getUserArtworks(userId, {
        page,
        page_size: pageSize,
      });

      if (response.data) {
        setArtworks(response.data.artworks);
        setTotalArtworks(response.data.total);
        setCurrentPage(response.data.page);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAccessDenied(true);
        setError("Access denied. You can only view your own artworks.");
      } else if (err.response?.status === 404) {
        setError("User not found");
      } else {
        const errorMsg = err.response?.data?.message || "Failed to load artworks";
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isNaN(userId)) {
      setError("Invalid user ID");
      setLoading(false);
      return;
    }

    fetchArtworks(1);
  }, [userId]);

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchArtworks(page);
  };

  // Handle delete artwork
  const handleDeleteClick = (artworkId: number) => {
    setArtworkToDelete(artworkId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!artworkToDelete) return;

    try {
      setDeleting(true);
      await deleteArtwork(artworkToDelete);
      
      toast.success("Artwork deleted successfully");
      
      // Refresh the artwork list
      fetchArtworks(currentPage);
      
      setDeleteDialogOpen(false);
      setArtworkToDelete(null);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to delete artwork";
      toast.error(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  // Calculate statistics
  const approvedCount = artworks.filter((a) => a.review_status === "approved").length;
  const pendingCount = artworks.filter((a) => a.review_status === "pending").length;

  if (loading && artworks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view this user's personal space.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You can only view your own artworks. Administrators can view all users' artworks.
            </p>
            <Button onClick={() => router.push("/activities")}>
              Back to Activities
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !accessDenied) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <ErrorMessage message={error} />
        <div className="mt-4">
          <Button onClick={() => router.push("/activities")}>
            Back to Activities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <UserCircle className="h-8 w-8 text-muted-foreground" />
          <h1 className="text-3xl font-bold">
            {isOwnSpace ? "My Artworks" : "User's Artworks"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isOwnSpace
            ? "View and manage all your submitted artworks"
            : "View all artworks submitted by this user"}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Total Artworks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalArtworks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Approved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pending Review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Artworks List */}
      <Card>
        <CardHeader>
          <CardTitle>Submitted Artworks</CardTitle>
          <CardDescription>
            {isOwnSpace
              ? "All artworks you have uploaded to various activities"
              : "All artworks uploaded by this user"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArtworkList
            artworks={artworks}
            pagination={{
              total: totalArtworks,
              page: currentPage,
              page_size: pageSize,
            }}
            onPageChange={handlePageChange}
            showActivity={true}
            showUser={false}
            onDelete={canAccess ? handleDeleteClick : undefined}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Artwork</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this artwork? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
