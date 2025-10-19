"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Home,
  Users,
  BarChart3,
  Heart,
  Monitor,
  Menu,
  X,
  Search,
  Bell,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/hooks/useOnboarding";

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Salles", href: "/rooms", icon: Calendar },
  { name: "Mes réservations", href: "/my-bookings", icon: Users },
  { name: "Favoris", href: "/favorites", icon: Heart },
  { name: "Rapports", href: "/reports", icon: BarChart3 },
  { name: "Wallboard", href: "/wallboard", icon: Monitor },
  { name: "Administration", href: "/admin", icon: Settings, adminOnly: true },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { resetOnboarding } = useOnboarding();

  // Simuler le statut administrateur (à remplacer par la vraie logique d'authentification)
  const isAdmin = true; // TODO: Remplacer par la vraie logique d'authentification

  // Filtrer la navigation selon les permissions
  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white border-slate-200 cursor-pointer"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen || !isMobile ? 0 : "-100%",
          width: isMobile ? (isOpen ? "280px" : "0px") : "280px",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 lg:translate-x-0 lg:static lg:inset-0",
          isMobile && "overflow-hidden"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-slate-200 px-6">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.1,
                type: "spring",
                damping: 15,
                stiffness: 200,
              }}
              className="flex items-center space-x-3"
            >
              <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                ReservApp
              </span>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-6 overflow-y-auto">
            {filteredNavigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-slate-200 p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
              className="flex items-center space-x-3"
            >
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-slate-900">
                  Utilisateur
                </p>
                <p className="text-xs text-slate-500 truncate">
                  admin@example.com
                </p>
              </div>

              {/* Bouton pour réinitialiser l'onboarding (dev only) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetOnboarding}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Réinitialiser l'onboarding"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 sm:px-6">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-600 hover:text-slate-900"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-slate-600 hover:text-slate-900 relative"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className="text-xs sm:text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          En ligne
        </span>

        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex border-slate-200 text-slate-700"
        >
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="sm:hidden border-slate-200 text-slate-700"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
