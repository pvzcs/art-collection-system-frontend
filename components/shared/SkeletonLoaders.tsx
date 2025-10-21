import { LoadingSkeleton } from './LoadingSpinner';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

/**
 * Skeleton loader for activity cards
 */
export function ActivityCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <LoadingSkeleton className="h-6 w-3/4 mb-2" />
        <LoadingSkeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <LoadingSkeleton className="h-4 w-full mb-2" />
        <LoadingSkeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter>
        <LoadingSkeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

/**
 * Skeleton loader for activity list
 */
export function ActivityListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ActivityCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for artwork cards
 */
export function ArtworkCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <LoadingSkeleton className="aspect-square w-full" />
      <CardContent className="p-4">
        <LoadingSkeleton className="h-4 w-3/4 mb-2" />
        <LoadingSkeleton className="h-3 w-1/2 mb-1" />
        <LoadingSkeleton className="h-3 w-2/3" />
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader for artwork list
 */
export function ArtworkListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ArtworkCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for review items
 */
export function ReviewItemSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <LoadingSkeleton className="h-5 w-5 rounded" />
      <LoadingSkeleton className="h-24 w-24 rounded" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton className="h-5 w-1/3" />
        <LoadingSkeleton className="h-4 w-1/2" />
        <LoadingSkeleton className="h-4 w-2/3" />
      </div>
      <LoadingSkeleton className="h-9 w-24" />
    </div>
  );
}

/**
 * Skeleton loader for review queue
 */
export function ReviewQueueSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ReviewItemSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for table rows
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <LoadingSkeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Skeleton loader for tables
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-4 text-left">
                <LoadingSkeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Skeleton loader for activity detail page
 */
export function ActivityDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <LoadingSkeleton className="h-8 w-1/2 mb-4" />
        <div className="flex gap-4 mb-4">
          <LoadingSkeleton className="h-5 w-32" />
          <LoadingSkeleton className="h-5 w-32" />
        </div>
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
      </div>
      <LoadingSkeleton className="h-10 w-40" />
    </div>
  );
}

/**
 * Skeleton loader for profile page
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <LoadingSkeleton className="h-6 w-1/3 mb-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <LoadingSkeleton className="h-4 w-20 mb-2" />
            <LoadingSkeleton className="h-10 w-full" />
          </div>
          <div>
            <LoadingSkeleton className="h-4 w-20 mb-2" />
            <LoadingSkeleton className="h-10 w-full" />
          </div>
          <div>
            <LoadingSkeleton className="h-4 w-20 mb-2" />
            <LoadingSkeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
