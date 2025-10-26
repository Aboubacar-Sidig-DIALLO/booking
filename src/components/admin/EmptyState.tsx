import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  iconColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconColor = "text-slate-400",
  gradientFrom = "from-slate-100",
  gradientTo = "to-slate-50",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-8 px-4"
    >
      {/* Container élégant avec effet glassmorphism */}
      <div className="relative w-full max-w-sm">
        {/* Fond avec dégradé élégant */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl blur-2xl opacity-50`}
        />

        {/* Contenu */}
        <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-lg shadow-slate-200/50">
          {/* Icone animée */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="flex justify-center mb-4"
          >
            <div className="relative">
              {/* Cercle extérieur animé */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full"
              />
              {/* Cercle intérieur */}
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-full p-6 border border-slate-200">
                <Icon className={`h-12 w-12 ${iconColor}`} strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>

          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-2"
          >
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Action optionnelle */}
          {action && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex justify-center"
            >
              {action}
            </motion.div>
          )}
        </div>

        {/* Particules décoratives */}
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-slate-300 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: 0,
              }}
              animate={{
                y: [
                  Math.random() * 100 + "%",
                  Math.random() * 50 + "%",
                  Math.random() * 100 + "%",
                ],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
