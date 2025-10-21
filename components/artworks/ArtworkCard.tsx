"use client";

import { useState } from "react";
import { Artwork } from "@/lib/types/models";
import { ArtworkImage } from "./ArtworkImage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface ArtworkCardProps {
  artwork: Artwork;
  showActivity?: boolean;
  showUser?: boolean;
  onDelete?: () => void;
  className?: string;
}

export function ArtworkCard({
  artwork,
  showActivity = false,
  showUser = false,
  onDelete,
  className,
}: ArtworkCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete artwork:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className={cn("overflow-hidden", className)} role="article" aria-label={`Artwork by ${artwork.user?.nickname || "Unknown"}`}>
        <CardContent className="p-0">
          {/* Artwork Image */}
          <div className="relative aspect-square">
            <ArtworkImage
              artworkId={artwork.id}
              alt={`Artwork by ${artwork.user?.nickname || "Unknown"}${showActivity && artwork.activity ? ` for ${artwork.activity.name}` : ''}`}
              className="w-full h-full"
            />
            
            {/* Review Status Badge */}
            <div className="absolute top-2 right-2">
              <Badge
                variant={artwork.review_status === "approved" ? "default" : "secondary"}
                aria-label={`Review status: ${artwork.review_status === "approved" ? "Approved" : "Pending review"}`}
              >
                {artwork.review_status === "approved" ? "Approved" : "Pending"}
              </Badge>
            </div>
          </div>

          {/* Artwork Info */}
          <div className="p-4 space-y-2">
            {/* Activity Name */}
            {showActivity && artwork.activity && (
              <p className="text-sm font-medium truncate">
                {artwork.activity.name}
              </p>
            )}

            {/* User Nickname */}
            {showUser && artwork.user && (
              <p className="text-sm text-muted-foreground truncate">
                by {artwork.user.nickname}
              </p>
            )}

            {/* Upload Time */}
            <p className="text-xs text-muted-foreground">
              <time dateTime={artwork.created_at}>{formatDateTime(artwork.created_at)}</time>
            </p>

            {/* Delete Button */}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                className="w-full mt-2 min-h-[44px]"
                onClick={() => setShowDeleteDialog(true)}
                aria-label="Delete this artwork"
              >
                <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent role="alertdialog" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
          <DialogHeader>
            <DialogTitle id="delete-dialog-title">Delete Artwork</DialogTitle>
            <DialogDescription id="delete-dialog-description">
              Are you sure you want to delete this artwork? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              aria-label="Cancel deletion"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label={isDeleting ? "Deleting artwork" : "Confirm delete artwork"}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
