export function UserSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="group rounded-xl border-2 border-purple-100 bg-gradient-to-br from-white to-purple-50/30 p-3 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <div className="h-6 w-6 bg-purple-300 rounded"></div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Name and status */}
                <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                  <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                </div>

                {/* Email, role, and bookings */}
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 flex-wrap">
                  <div className="h-4 bg-gray-200 rounded w-40 sm:w-48 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 sm:gap-1 flex-shrink-0 justify-start sm:justify-end">
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-8 sm:h-9 sm:w-9 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
