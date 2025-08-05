export default function ProfileLoadingSkeleton() {
  return (
    <div className="bg-theme-light-blue shadow rounded-lg p-6 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between items-center pb-4">
          <div className="w-full space-y-1">
            <div className="h-4 w-24 bg-theme-blue rounded" />
            <div className="h-5 w-3/4 bg-theme-blue rounded" />
          </div>
        </div>
      ))}

      <div className="pt-6 flex justify-end gap-4">
        {/* Always show one button */}
        <div className="h-10 w-16 bg-theme-blue rounded" />

        {/* Second button only if user */}
        <div className="h-10 w-36 bg-theme-blue rounded" />
      </div>
    </div>
  );
}
