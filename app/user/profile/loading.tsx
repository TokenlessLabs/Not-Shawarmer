export default function Loading() {
  return (
    <main className="min-h-screen p-10 animate-pulse">
      <h1 className="text-4xl font-bold mb-12 text-theme-dark-blue">
        Your Profile
      </h1>

      <div className="bg-theme-light-blue shadow rounded-lg p-6 space-y-6">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="flex justify-between items-center pb-4">
            <div className="w-full space-y-1">
              <div className="h-3 w-24 bg-theme-blue rounded" />
              <div className="h-5 w-3/4 bg-theme-blue rounded" />
            </div>
          </div>
        ))}

        <div className="pt-6 flex justify-end gap-4">
          <div className="h-9 w-16 bg-theme-blue rounded" />
          <div className="h-9 w-24 bg-theme-blue rounded" />
        </div>
      </div>
    </main>
  );
}
