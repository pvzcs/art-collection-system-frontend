"use client";

import { Artwork } from "@/lib/types/models";
import { ArtworkImage } from "@/components/artworks/ArtworkImage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ExternalLink } from "lucide-react";
import { formatDateTime } from "@/lib/utils/formatters";
import Link from "next/link";

interface ReviewItemProps {
  artwork: Artwork;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onApprove: () => void;
}

export function ReviewItem({
  artwork,
  selected,
  onSelect,
  onApprove,
}: ReviewItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Selection Checkbox and Preview - Mobile Layout */}
          <div className="flex gap-4 sm:contents">
            <div className="flex items-start pt-1">
              <Checkbox
                checked={selected}
                onCheckedChange={onSelect}
                aria-label={`Select artwork ${artwork.id}`}
                className="min-h-[44px] min-w-[44px]"
              />
            </div>

            {/* Artwork Preview */}
            <div className="w-32 h-32 flex-shrink-0">
              <ArtworkImage
                artworkId={artwork.id}
                alt={`Artwork by ${artwork.user?.nickname || "Unknown"}`}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Artwork Information */}
          <div className="flex-1 space-y-2 min-w-0">
            {/* User Information */}
            <div>
              <p className="text-sm font-medium">
                User:{" "}
                <Link
                  href={`/users/${artwork.user_id}`}
                  className="text-primary hover:underline inline-flex items-center gap-1 min-h-[44px] py-2"
                >
                  {artwork.user?.nickname || "Unknown"}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </p>
              {artwork.user?.email && (
                <p className="text-xs text-muted-foreground break-all">
                  {artwork.user.email}
                </p>
              )}
            </div>

            {/* Activity Information */}
            {artwork.activity && (
              <p className="text-sm text-muted-foreground">
                Activity: <span className="font-medium">{artwork.activity.name}</span>
              </p>
            )}

            {/* Upload Time */}
            <p className="text-xs text-muted-foreground">
              Uploaded: {formatDateTime(artwork.created_at)}
            </p>

            {/* File Name */}
            <p className="text-xs text-muted-foreground truncate">
              File: {artwork.file_name}
            </p>
          </div>

          {/* Approve Button */}
          <div className="flex items-start sm:items-start">
            <Button
              onClick={onApprove}
              size="sm"
              className="w-full sm:w-auto min-h-[44px]"
            >
              <Check />
              Approve
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
