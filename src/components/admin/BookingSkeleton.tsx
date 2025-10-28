export function BookingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 border border-slate-200 rounded-lg bg-white"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Icône */}
              <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center animate-pulse">
                <div className="h-6 w-6 bg-blue-200 rounded-lg"></div>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                {/* Titre et badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>

                {/* Informations */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
