"use client";

import { useState } from "react";
import { Artwork } from "@/lib/types/models";
import { ReviewItem } from "./ReviewItem";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/shared/Pagination";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ReviewQueueProps {
  artworks: Artwork[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
  };
  onPageChange: (page: number) => void;
  onReview: (ids: number[], approved: boolean) => Promise<void>;
}

export function ReviewQueue({
  artworks,
  pagination,
  onPageChange,
  onReview,
}: ReviewQueueProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isReviewing, setIsReviewing] = useState(false);
  const { t } = useTranslation();

  const totalPages = Math.ceil(pagination.total / pagination.page_size);

  // Handle individual artwork selection
  const handleSelect = (artworkId: number, selected: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(artworkId);
      } else {
        newSet.delete(artworkId);
      }
      return newSet;
    });
  };

  // Handle select all toggle
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(artworks.map((a) => a.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Handle individual approve
  const handleIndividualApprove = async (artworkId: number) => {
    try {
      setIsReviewing(true);
      await onReview([artworkId], true);
      toast.success(t('admin.artworkApproved'));
      
      // Remove from selected if it was selected
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(artworkId);
        return newSet;
      });
    } catch (error: any) {
      console.error("Failed to approve artwork:", error);
      toast.error(error.response?.data?.message || t('admin.artworksFailed'));
    } finally {
      setIsReviewing(false);
    }
  };

  // Handle batch approve
  const handleBatchApprove = async () => {
    if (selectedIds.size === 0) {
      toast.error(t('admin.selectAtLeastOne'));
      return;
    }

    try {
      setIsReviewing(true);
      const ids = Array.from(selectedIds);
      await onReview(ids, true);
      toast.success(t('admin.batchApproveSuccess').replace('{count}', ids.length.toString()));
      setSelectedIds(new Set());
    } catch (error: any) {
      console.error("Failed to batch approve artworks:", error);
      toast.error(error.response?.data?.message || t('admin.artworksFailed'));
    } finally {
      setIsReviewing(false);
    }
  };

  const allSelected = artworks.length > 0 && selectedIds.size === artworks.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < artworks.length;

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('admin.noPendingArtworks')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Batch Actions Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all artworks"
            className={`min-h-[44px] min-w-[44px] ${someSelected ? "data-[state=checked]:bg-primary/50" : ""}`}
          />
          <span className="text-sm font-medium">
            {selectedIds.size > 0
              ? `${selectedIds.size} ${t('admin.selected')}`
              : t('admin.selectAll')}
          </span>
        </div>

        <Button
          onClick={handleBatchApprove}
          disabled={selectedIds.size === 0 || isReviewing}
          size="sm"
          className="min-h-[44px] w-full sm:w-auto"
        >
          <Check />
          {t('admin.approveSelected')} ({selectedIds.size})
        </Button>
      </div>

      {/* Review Items List */}
      <div className="space-y-3">
        {artworks.map((artwork) => (
          <ReviewItem
            key={artwork.id}
            artwork={artwork}
            selected={selectedIds.has(artwork.id)}
            onSelect={(selected) => handleSelect(artwork.id, selected)}
            onApprove={() => handleIndividualApprove(artwork.id)}
          />
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
