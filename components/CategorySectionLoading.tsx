import { CategoryCardSkeleton } from './ui/skeleton';

const CategorySectionLoading = () => {
  return (
    <section className="py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mx-auto mb-6 md:mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySectionLoading;