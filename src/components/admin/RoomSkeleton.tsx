export function RoomSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="p-3 sm:p-3 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {/* Icône */}
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center animate-pulse flex-shrink-0 ${
                  i % 3 === 0
                    ? "bg-green-100"
                    : i % 3 === 1
                      ? "bg-orange-100"
                      : "bg-red-100"
                }`}
              >
                <div
                  className={`h-6 w-6 bg-gradient-to-br rounded-lg ${
                    i % 3 === 0
                      ? "from-green-300 to-emerald-300"
                      : i % 3 === 1
                        ? "from-orange-300 to-amber-300"
                        : "from-red-300 to-rose-300"
                  }`}
                ></div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Nom */}
                <div className="h-5 bg-gray-200 rounded w-28 sm:w-32 animate-pulse"></div>
              </div>

              {/* Infos détaillées - sur la même ligne */}
              <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>

            {/* Status et Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Status */}
              <div
                className={`h-6 px-2 rounded-full flex items-center gap-1 animate-pulse ${
                  i % 3 === 0
                    ? "bg-green-100"
                    : i % 3 === 1
                      ? "bg-orange-100"
                      : "bg-red-100"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>

              {/* Actions */}
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Infos détaillées mobile */}
          <div className="flex items-center gap-2 sm:hidden mt-2">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>

          {/* Actions supplémentaires mobile */}
          <div className="flex items-center justify-end gap-2 sm:hidden mt-2 pt-2 border-t border-gray-100">
            <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
