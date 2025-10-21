'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ReviewQueue } from '@/components/admin/ReviewQueue';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Artwork } from '@/lib/types/models';
import { getReviewQueue, reviewArtwork, batchReviewArtworks } from '@/lib/api/admin';
import { toast } from 'sonner';

export default function AdminReviewQueuePage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    page_size: 20,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewQueue = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getReviewQueue({ page, page_size: 20 });
      
      if (response.data) {
        setArtworks(response.data.artworks);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          page_size: response.data.page_size,
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load review queue';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewQueue();
  }, []);

  const handlePageChange = (page: number) => {
    fetchReviewQueue(page);
  };

  const handleReview = async (ids: number[], approved: boolean) => {
    if (ids.length === 1) {
      // Single artwork review
      await reviewArtwork(ids[0], approved);
    } else {
      // Batch review
      await batchReviewArtworks(ids, approved);
    }
    
    // Refresh the review queue after approval
    await fetchReviewQueue(pagination.page);
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Review Queue</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve pending artwork submissions
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage
            title="Failed to Load Review Queue"
            message={error}
            variant="card"
            onRetry={() => fetchReviewQueue(pagination.page)}
          />
        ) : (
          <ReviewQueue
            artworks={artworks}
            pagination={pagination}
            onPageChange={handlePageChange}
            onReview={handleReview}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
