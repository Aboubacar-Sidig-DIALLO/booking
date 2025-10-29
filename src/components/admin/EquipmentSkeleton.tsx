export function EquipmentSkeleton() {
  // Variants alternatifs pour plus de dynamisme
  const variants = [
    {
      iconBg: "bg-blue-100",
      icon: "bg-blue-300",
      hasDescription: true,
      delay: 0,
    },
    {
      iconBg: "bg-green-100",
      icon: "bg-green-300",
      hasDescription: false,
      delay: 50,
    },
    {
      iconBg: "bg-purple-100",
      icon: "bg-purple-300",
      hasDescription: true,
      delay: 100,
    },
    {
      iconBg: "bg-indigo-100",
      icon: "bg-indigo-300",
      hasDescription: false,
      delay: 150,
    },
    {
      iconBg: "bg-pink-100",
      icon: "bg-pink-300",
      hasDescription: true,
      delay: 200,
    },
    {
      iconBg: "bg-orange-100",
      icon: "bg-orange-300",
      hasDescription: true,
      delay: 250,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => {
        const variant = variants[(i - 1) % variants.length];
        return (
          <div
            key={i}
            className="border-2 border-green-200 bg-white shadow-sm hover:shadow-xl rounded-lg animate-pulse"
            style={{ animationDelay: `${variant.delay}ms` }}
          >
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Icon container */}
                  <div
                    className={`p-2 rounded-xl ${variant.iconBg} flex-shrink-0`}
                  >
                    <div className={`h-6 w-6 ${variant.icon} rounded`}></div>
                  </div>

                  {/* Title with optional info and description */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base flex items-center gap-2 text-slate-900">
                      <div className="h-5 bg-gray-200 rounded w-32 inline-block"></div>
                      {/* Optional info icon - sometimes visible */}
                      {i % 3 === 0 && (
                        <div className="h-4 w-4 bg-gray-200 rounded flex-shrink-0"></div>
                      )}
                    </h4>

                    {/* Description (conditional) */}
                    {variant.hasDescription && (
                      <p className="text-xs mt-0.5 line-clamp-1 text-gray-600">
                        <span className="inline-block h-3 bg-gray-200 rounded w-48"></span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Toggle button */}
                <div className="h-8 w-8 bg-gray-200 rounded flex-shrink-0"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
