"use client";

import { Suspense, lazy, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoadingSpinner, LoadingCard } from "@/components/common/Loading";

// Lazy load des composants lourds
const AvailabilityTimeline = lazy(
  () => import("@/components/booking/AvailabilityTimeline")
);
const BookingWizard = lazy(() => import("@/components/booking/BookingWizard"));
const ChatBox = lazy(() => import("@/components/chat/ChatBox"));

// Composant de fallback optimisé
const TimelineFallback = () => (
  <div className="space-y-4">
    <div className="h-8 bg-gradient-primary rounded-lg animate-pulse" />
    <div className="grid grid-cols-24 gap-1">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="h-16 bg-muted rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  </div>
);

const BookingWizardFallback = () => (
  <div className="space-y-6">
    <div className="h-12 bg-gradient-primary rounded-xl animate-pulse" />
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  </div>
);

const ChatBoxFallback = () => (
  <div className="h-96 border rounded-xl p-4 space-y-4">
    <div className="h-8 bg-gradient-primary rounded-lg animate-pulse" />
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="flex gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
            <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Wrapper avec Suspense
export function LazyAvailabilityTimeline(props: any) {
  return (
    <Suspense fallback={<TimelineFallback />}>
      <AvailabilityTimeline {...props} />
    </Suspense>
  );
}

export function LazyBookingWizard(props: any) {
  return (
    <Suspense fallback={<BookingWizardFallback />}>
      <BookingWizard {...props} />
    </Suspense>
  );
}

export function LazyChatBox(props: any) {
  return (
    <Suspense fallback={<ChatBoxFallback />}>
      <ChatBox {...props} />
    </Suspense>
  );
}

// Hook pour optimiser les animations
export function useOptimizedAnimation() {
  return {
    // Animations optimisées pour GPU
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, ease: "easeOut" },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: "easeOut" },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3, ease: "easeOut" },
    },
    // Animation de stagger optimisée
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1,
        },
      },
    },
    staggerItem: {
      initial: { opacity: 0, y: 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    },
  };
}

// Composant pour les animations de scroll optimisées
export function ScrollAnimation({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Hook pour détecter les préférences de mouvement réduit
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// Composant d'animation conditionnelle
export function ConditionalAnimation({
  children,
  animation,
  className,
}: {
  children: React.ReactNode;
  animation?: any;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} {...animation}>
      {children}
    </motion.div>
  );
}
