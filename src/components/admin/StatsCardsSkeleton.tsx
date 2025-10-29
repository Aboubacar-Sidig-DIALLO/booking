import { Card, CardContent } from "@/components/ui/card";

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Salles totales */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
              <div className="flex items-center gap-1 mt-1.5">
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Réservations actives */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-28 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
              <div className="flex items-center gap-1 mt-1.5">
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Utilisateurs */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Salles en maintenance */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
              <div className="flex items-center gap-1 mt-1.5">
                <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
              </div>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
