export default function Loading() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-8" />
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6" />
      <div className="flex gap-8">
        <aside style={{ width: "256px", minWidth: "256px" }} className="shrink-0 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </aside>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
