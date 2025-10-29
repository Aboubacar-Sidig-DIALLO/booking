export function SystemAlertsSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200">
      <div className="mb-6">
        <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border rounded-xl p-4 animate-pulse bg-yellow-50 border-yellow-200"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-16 rounded-full animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
