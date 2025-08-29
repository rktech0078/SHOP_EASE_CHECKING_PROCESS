import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images Gallery Skeleton */}
        <div className="w-full md:w-1/2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          
          <div className="grid grid-cols-4 gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="w-full md:w-1/2">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-6" />
          
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-24 w-full mb-6" />
          
          <Skeleton className="h-6 w-1/3 mb-2" />
          <div className="space-y-2 mb-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-5 w-full" />
            ))}
          </div>
          
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-12 w-1/3 mb-6" />
          
          <Skeleton className="h-12 w-full mb-6" />
          
          <Skeleton className="h-6 w-1/4 mb-2" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}