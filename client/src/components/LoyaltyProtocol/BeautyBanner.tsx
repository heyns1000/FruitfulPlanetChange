/**
 * BeautyBanner Component - Batch 2 Airshow Loyalty Protocol
 * 
 * Displays the Beauty principle banner with pink flyer cascade animation
 * and PulseGlow™ heartbeat integration (0.9s timing)
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Flyer {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
}

interface BeautyBannerProps {
  flyerCount?: number;
  displayLimit?: number;
  showMetrics?: boolean;
  className?: string;
}

export function BeautyBanner({ 
  flyerCount = 400000, 
  displayLimit = 50,
  showMetrics = true,
  className = ''
}: BeautyBannerProps) {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [isPulsing, setIsPulsing] = useState(true);

  // Initialize flyers on mount
  useEffect(() => {
    const initialFlyers: Flyer[] = [];
    for (let i = 0; i < displayLimit; i++) {
      initialFlyers.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -100,
        rotation: Math.random() * 30 - 15,
        delay: Math.random() * 3,
      });
    }
    setFlyers(initialFlyers);
  }, [displayLimit]);

  // Respawn flyers continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setFlyers(prevFlyers => {
        const newFlyers = prevFlyers.map(flyer => {
          // Check if flyer has fallen off screen
          if (flyer.y > 110) {
            return {
              ...flyer,
              id: flyer.id + displayLimit,
              x: Math.random() * 100,
              y: -10,
              rotation: Math.random() * 30 - 15,
              delay: 0,
            };
          }
          return flyer;
        });
        return newFlyers;
      });
    }, 200); // Respawn rate

    return () => clearInterval(interval);
  }, [displayLimit]);

  const flyerVariants = {
    initial: (flyer: Flyer) => ({
      x: `${flyer.x}vw`,
      y: `${flyer.y}vh`,
      rotate: flyer.rotation,
      opacity: 0,
    }),
    animate: (flyer: Flyer) => ({
      x: `${flyer.x + (Math.random() - 0.5) * 30}vw`,
      y: '110vh',
      rotate: flyer.rotation + (Math.random() - 0.5) * 360,
      opacity: [0, 0.8, 0.8, 0],
      transition: {
        duration: 3,
        delay: flyer.delay,
        ease: 'easeInOut',
        opacity: {
          duration: 3,
          times: [0, 0.1, 0.8, 1],
        },
      },
    }),
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 0.9, // PulseGlow™ heartbeat
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Pink Flyer Cascade Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {flyers.map((flyer) => (
            <motion.img
              key={flyer.id}
              src="/assets/banners/beauty-pink-flyer.svg"
              alt=""
              className="absolute w-12 h-16"
              custom={flyer}
              variants={flyerVariants}
              initial="initial"
              animate="animate"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 105, 180, 0.6))',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Main Banner Content */}
      <motion.div
        className="relative z-10 p-8 rounded-lg bg-gradient-to-br from-pink-500/20 via-rose-400/20 to-pink-300/20 backdrop-blur-sm border-2 border-pink-400"
        variants={pulseVariants}
        animate={isPulsing ? 'pulse' : 'initial'}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="text-6xl"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              🌸
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                BEAUTY PRINCIPLE
              </h2>
              <p className="text-lg text-pink-700 dark:text-pink-300 mt-1">
                Batch 2 - Airshow Loyalty Protocol
              </p>
            </div>
          </div>

          {showMetrics && (
            <div className="text-right">
              <motion.div
                className="text-4xl font-bold text-pink-600 dark:text-pink-400"
                variants={pulseVariants}
                animate="pulse"
              >
                {flyerCount.toLocaleString()}
              </motion.div>
              <p className="text-sm text-pink-700 dark:text-pink-300">
                Pink Flyers Deployed
              </p>
            </div>
          )}
        </div>

        {showMetrics && (
          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-pink-500"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                }}
              />
              <span className="text-sm text-pink-700 dark:text-pink-300">
                PulseGlow™ Active (0.9s)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                ✅ DEPLOYED
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-pink-700 dark:text-pink-300">
                Authorization: FAAC-4.5.1-BEAUTY-GO
              </span>
            </div>
          </div>
        )}

        {/* Beauty Philosophy Quote */}
        <motion.div
          className="mt-4 p-4 bg-pink-100/50 dark:bg-pink-900/20 rounded-lg border border-pink-300 dark:border-pink-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm italic text-pink-800 dark:text-pink-200">
            "Beauty is not just what we see—it's the harmony beneath the surface, 
            the elegance in structure, and the grace in every interaction."
          </p>
        </motion.div>
      </motion.div>

      {/* Toggle Pulse Control (Debug) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setIsPulsing(!isPulsing)}
          className="absolute bottom-4 right-4 z-20 px-3 py-1 text-xs bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
        >
          {isPulsing ? 'Pause Pulse' : 'Resume Pulse'}
        </button>
      )}
    </div>
  );
}

export default BeautyBanner;
