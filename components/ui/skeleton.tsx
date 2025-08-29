import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  // Extends HTML div attributes
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="aspect-square w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="aspect-square w-full">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
      <div className="absolute inset-0 flex items-end p-4">
        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  );
}

export function HeroSectionSkeleton() {
  return (
    <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-4">
        <Skeleton className="h-10 w-3/4 max-w-md" />
        <Skeleton className="h-6 w-2/3 max-w-sm" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  );
}