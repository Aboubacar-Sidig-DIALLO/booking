export function UserSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="p-4 border border-purple-200 rounded-lg bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Avatar */}
              <div className="h-10 w-10 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center animate-pulse">
                <div className="h-8 w-8 bg-purple-200 rounded-full"></div>
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                {/* Nom */}
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>

                {/* Email */}
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Badges et infos */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
          </div>

          {/* Informations supplémentaires */}
          <div className="space-y-1 mt-3 pt-3 border-t border-gray-100">
            <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
