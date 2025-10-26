import { motion } from "framer-motion";

interface LoadingDotsProps {
  size?: number;
  color?: string;
}

export function LoadingDots({
  size = 8,
  color = "#0f172a", // slate-900 par défaut
}: LoadingDotsProps) {
  const dots = [
    { delay: 0, duration: 0.6 },
    { delay: 0.2, duration: 0.6 },
    { delay: 0.4, duration: 0.6 },
  ];

  return (
    <div
      className="flex items-center justify-center gap-2"
      style={{ height: `${size * 3.5}px` }}
    >
      {dots.map((config, index) => (
        <motion.div
          key={index}
          className="rounded-full"
          animate={{
            y: [0, -size, 0],
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
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${size}px ${color}40`,
          }}
        />
      ))}
    </div>
  );
}
