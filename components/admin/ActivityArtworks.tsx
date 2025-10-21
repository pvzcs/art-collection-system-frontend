'use client';

import { useState, useEffect } from 'react';
import { Artwork, Activity } from '@/lib/types/models';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/shared/Pagination';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatDate } from '@/lib/utils/formatters';
import { ExternalLink, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getActivityArtworks } from '@/lib/api/admin';
import { ArtworkImage } from '@/components/artworks/ArtworkImage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ActivityArtworksProps {
  activity: Activity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityArtworks({ activity, open, onOpenChange }: ActivityArtworksProps) {
  const { t } = useTranslation();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const pageSize = 20;

  const fetchArtworks = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getActivityArtworks(activity.id, { 
        page, 
        page_size: pageSize 
      });

      if (response.code === 0 && response.data) {
        setArtworks(response.data.artworks);
        setTotal(response.data.total);
        setTotalPages(Math.ceil(response.data.total / pageSize));
        setCurrentPage(page);
      } else {
        toast.error(response.message || t('errors.loadFailed'));
      }
    } catch (error: any) {
      console.error('Failed to fetch activity artworks:', error);
      toast.error(error.response?.data?.message || t('errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchArtworks(1);
    }
  }, [open, activity.id]);

  const handlePageChange = (page: number) => {
    fetchArtworks(page);
  };

  const handlePreviewArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setPreviewOpen(true);
  };

  const handleDownloadArtwork = (artwork: Artwork) => {
    // Create download link
    const link = document.createElement('a');
    link.href = `/api/artworks/${artwork.id}/download`;
    link.download = artwork.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">{t('artworks.approved')}</Badge>;
      case 'pending':
        return <Badge variant="secondary">{t('artworks.pending')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('artworks.rejected')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              {t('admin.activityArtworks')} - {activity.name}
            </DialogTitle>
            <DialogDescription>
              {t('admin.activityArtworksDesc')} ({total} {t('admin.totalArtworks')})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isLoading && artworks.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" text={t('common.loading')} />
              </div>
            ) : artworks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('admin.noArtworksInActivity')}</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.artwork')}</TableHead>
                        <TableHead>{t('admin.author')}</TableHead>
                        <TableHead>{t('admin.status')}</TableHead>
                        <TableHead>{t('common.createdAt')}</TableHead>
                        <TableHead className="text-right">{t('common.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {artworks.map((artwork) => (
                        <TableRow key={artwork.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded overflow-hidden">
                                <ArtworkImage
                                  artworkId={artwork.id}
                                  alt={artwork.file_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="truncate max-w-[200px]">
                                {artwork.file_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{artwork.user?.nickname}</p>
                              <p className="text-xs text-muted-foreground">
                                {artwork.user?.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(artwork.review_status)}
                          </TableCell>
                          <TableCell>{formatDate(artwork.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePreviewArtwork(artwork)}
                                title={t('admin.previewArtwork')}
                                className="min-h-[44px] min-w-[44px]"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDownloadArtwork(artwork)}
                                title={t('admin.downloadArtwork')}
                                className="min-h-[44px] min-w-[44px]"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {artworks.map((artwork) => (
                    <div
                      key={artwork.id}
                      className="border rounded-lg p-4 space-y-3 bg-card"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                          <ArtworkImage
                            artworkId={artwork.id}
                            alt={artwork.file_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{artwork.file_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('admin.author')}: {artwork.user?.nickname}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {artwork.user?.email}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(artwork.review_status)}
                          <p className="text-xs text-muted-foreground">
                            {formatDate(artwork.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 min-h-[44px]"
                          onClick={() => handlePreviewArtwork(artwork)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t('admin.preview')}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 min-h-[44px]"
                          onClick={() => handleDownloadArtwork(artwork)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {t('admin.download')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-6"
                  />
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Artwork Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.artworkPreview')}</DialogTitle>
            <DialogDescription>
              {selectedArtwork?.file_name} - {selectedArtwork?.user?.nickname}
            </DialogDescription>
          </DialogHeader>
          
          {selectedArtwork && (
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <ArtworkImage
                  artworkId={selectedArtwork.id}
                  alt={selectedArtwork.file_name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('admin.author')}</p>
                  <p className="font-medium">{selectedArtwork.user?.nickname}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('admin.status')}</p>
                  {getStatusBadge(selectedArtwork.review_status)}
                </div>
                <div>
                  <p className="text-muted-foreground">{t('common.createdAt')}</p>
                  <p>{formatDate(selectedArtwork.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('admin.fileName')}</p>
                  <p className="truncate">{selectedArtwork.file_name}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}