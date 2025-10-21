"use client";

import { useState, useEffect } from "react";
import { getArtworkImage } from "@/lib/api/artworks";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtworkImageProps {
  artworkId: number;
  alt: string;
  className?: string;
}

export function ArtworkImage({ artworkId, alt, className }: ArtworkImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);
        setAccessDenied(false);

        const blob = await getArtworkImage(artworkId);
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (err: any) {
        console.error("Failed to load artwork image:", err);
        
        // Check if it's a 403 error (access denied)
        if (err.response?.status === 403) {
          setAccessDenied(true);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    // Cleanup: revoke object URL when component unmounts
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [artworkId]);

  if (loading) {
    return (
      <LoadingSkeleton
        className={cn("w-full aspect-square", className)}
      />
    );
  }

  if (accessDenied) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-muted rounded-md aspect-square",
          className
        )}
      >
        <ImageOff className="h-8 w-8 text-muted-foreground" />
        <p className="text-xs text-muted-foreground text-center px-2">
          Access Denied
        </p>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-muted rounded-md aspect-square",
          className
        )}
      >
        <ImageOff className="h-8 w-8 text-muted-foreground" />
        <p className="text-xs text-muted-foreground text-center px-2">
          Failed to load image
        </p>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={cn("w-full h-full object-cover rounded-md", className)}
      loading="lazy"
    />
  );
}
