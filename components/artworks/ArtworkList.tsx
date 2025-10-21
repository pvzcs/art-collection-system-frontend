"use client";

import { Artwork } from "@/lib/types/models";
import { ArtworkCard } from "./ArtworkCard";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtworkListProps {
  artworks: Artwork[];
  pagination?: {
    total: number;
    page: number;
    page_size: number;
  };
  onPageChange?: (page: number) => void;
  showActivity?: boolean;
  showUser?: boolean;
  onDelete?: (id: number) => void;
  loading?: boolean;
  className?: string;
}

export function ArtworkList({
  artworks,
  pagination,
  onPageChange,
  showActivity = false,
  showUser = false,
  onDelete,
  loading = false,
  className,
}: ArtworkListProps) {
  // Calculate total pages
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.page_size)
    : 1;

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <LoadingSkeleton className="w-full aspect-square" />
              <LoadingSkeleton className="w-3/4 h-4" />
              <LoadingSkeleton className="w-1/2 h-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (artworks.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12", className)} role="status" aria-live="polite">
        <div className="rounded-full bg-muted p-6 mb-4" aria-hidden="true">
          <ImageOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No artworks found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          There are no artworks to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Artwork Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list" aria-label="Artworks gallery">
        {artworks.map((artwork) => (
          <div key={artwork.id} role="listitem">
            <ArtworkCard
              artwork={artwork}
              showActivity={showActivity}
              showUser={showUser}
              onDelete={onDelete ? () => onDelete(artwork.id) : undefined}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && onPageChange && totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
