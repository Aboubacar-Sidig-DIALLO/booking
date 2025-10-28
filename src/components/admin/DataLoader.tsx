"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface DataLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
}

export function DataLoader({
  message = "Chargement des données...",
  size = "md",
  variant = "spinner",
}: DataLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const dots = [
    { delay: 0, duration: 0.6 },
    { delay: 0.2, duration: 0.6 },
    { delay: 0.4, duration: 0.6 },
  ];

  const dotSize = size === "sm" ? 4 : size === "md" ? 6 : 8;

  if (variant === "dots") {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 w-full">
        <div className="flex items-center justify-center gap-2 mb-4">
          {dots.map((config, index) => (
            <motion.div
              key={index}
              className="rounded-full bg-gradient-to-br from-indigo-500 to-blue-600"
              animate={{
                y: [0, -dotSize, 0],
                scale: [1, 1.2, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: config.duration,
                delay: config.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                boxShadow: `0 0 ${dotSize * 2}px rgba(99, 102, 241, 0.4)`,
              }}
            />
          ))}
        </div>
        <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
          {message}
        </p>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 w-full">
        <motion.div
          className={`rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 ${sizeClasses[size]} mb-4`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            boxShadow: `0 0 ${size === "sm" ? 8 : size === "md" ? 12 : 16}px rgba(99, 102, 241, 0.5)`,
          }}
        />
        <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
          {message}
        </p>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 w-full">
      <Loader2
        className={`${sizeClasses[size]} text-indigo-600 mb-4 animate-spin`}
      />
      <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
        {message}
      </p>
    </div>
  );
}
