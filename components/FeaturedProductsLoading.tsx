

const FeaturedProductsLoading = () => {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="h-8 w-40 sm:w-56 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse" />
          <div className="h-6 w-20 sm:w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse" />
        </div>

        {/* Product Grid Skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product image skeleton */}
              <div className="h-40 sm:h-48 md:h-56 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />

              <div className="p-3 sm:p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-md animate-pulse" />
                <div className="h-3 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsLoading;
