export default function Loading() {
  return (
    <div className="animate-pulse ">
      {/* Category Bar Skeleton */}
      <div className="sticky top-0 bg-white z-10 overflow-x-auto whitespace-nowrap py-3 shadow-sm border-t border-b mb-6 pl-6 md:pl-10">
        <div className="flex gap-4 w-max">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-gray-200 rounded-full"
            ></div>
          ))}
        </div>
      </div>

      {/* Search & Filter Skeleton */}
      <div className="flex justify-center mt-7 px-4 pt-5">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl">
          <div className="flex items-center gap-2 w-full md:w-3/4">
            <div className="w-6 h-6 bg-gray-300 rounded-full" />
            <div className="w-full h-10 bg-gray-200 rounded-full" />
          </div>
          <div className="w-40 h-10 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Menu Items Skeleton */}
      <div className="mt-12 space-y-12 px-6 md:px-10">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-5 border-b-2">
              <div className="h-8 w-40 bg-gray-200 rounded"></div>
              <div className="h-6 w-6 bg-red-200 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="h-48 bg-gray-200 rounded-xl"
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
