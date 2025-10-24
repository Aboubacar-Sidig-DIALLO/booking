"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Compte à rebours
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Redirection automatique quand le compte à rebours atteint 0
    if (countdown === 0) {
      router.replace("/login");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration moderne */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            {/* Cercle principal avec animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
              <svg
                className="w-16 h-16 text-blue-600 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 4c-2.34 0-4.29 1.009-5.824 2.709"
                />
              </svg>
            </div>
            {/* Particules flottantes */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-ping animation-delay-1000"></div>
            <div className="absolute top-1/2 -left-4 w-2 h-2 bg-green-400 rounded-full animate-ping animation-delay-2000"></div>
          </div>
        </div>

        {/* Titre principal */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Oups !
        </h1>

        {/* Sous-titre */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6 px-4">
          Page introuvable
        </h2>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed px-4">
          Cette page n'existe pas.
          <br />
          Redirection vers la connexion...
        </p>

        {/* Call-to-action principal */}
        <div className="space-y-4 mb-8 px-4">
          <Link
            href="/login"
            className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Se connecter
          </Link>
        </div>

        {/* Compte à rebours */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-white/20 mx-4">
          <p className="text-gray-600 mb-2 text-sm md:text-base">
            Redirection dans
          </p>
          <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
            {countdown}s
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(countdown / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Styles CSS personnalisés pour les animations */}
      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
