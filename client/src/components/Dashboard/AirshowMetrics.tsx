/**
 * AirshowMetrics Component - Loyalty Protocol Dashboard
 *
 * Displays status of all three principles in the Airshow Loyalty Protocol
 * Shows TRUTH (Batch 1), BEAUTY (Batch 2), and CURIOSITY (Batch 3) status
 */

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PrincipleStatus {
  name: string;
  icon: string;
  batch: number;
  status: 'active' | 'pending' | 'inactive';
  flyerCount: number;
  color: string;
  bgColor: string;
  borderColor: string;
  authCode: string;
  payment: string;
}

const principles: PrincipleStatus[] = [
  {
    name: 'TRUTH',
    icon: '✨',
    batch: 1,
    status: 'active',
    flyerCount: 400000,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400',
    authCode: 'FAAC-4.5.1-TRUTH-GO',
    payment: '$140 USD',
  },
  {
    name: 'BEAUTY',
    icon: '🌸',
    batch: 2,
    status: 'active',
    flyerCount: 400000,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-400',
    authCode: 'FAAC-4.5.1-BEAUTY-GO',
    payment: '$140 USD',
  },
  {
    name: 'CURIOSITY',
    icon: '🔬',
    batch: 3,
    status: 'pending',
    flyerCount: 0,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-400',
    authCode: 'FAAC-4.5.1-CURIOSITY-PENDING',
    payment: 'Awaiting $140 USD',
  },
];

interface AirshowMetricsProps {
  className?: string;
  showDetails?: boolean;
}

export function AirshowMetrics({ className = '', showDetails = true }: AirshowMetricsProps) {
  const activePrinciples = principles.filter((p) => p.status === 'active').length;
  const totalPrinciples = principles.length;
  const totalFlyers = principles.reduce((sum, p) => sum + p.flyerCount, 0);

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 0.9, // PulseGlow™ heartbeat
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Airshow Loyalty Protocol Dashboard
        </CardTitle>
        <CardDescription>
          Three Principles of Digital Excellence - FAAC Architect 4.5.1
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Overall Status */}
        <motion.div
          className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-400"
          variants={pulseVariants}
          animate="pulse"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {activePrinciples}/{totalPrinciples} Principles Active
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                Total Flyers Deployed: {totalFlyers.toLocaleString()}
              </p>
            </div>
            <motion.div
              className="text-5xl"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              🚀
            </motion.div>
          </div>
        </motion.div>

        {/* Individual Principle Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.name}
              className={`p-4 rounded-lg border-2 ${principle.bgColor} ${principle.borderColor}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <motion.div
                  className="text-3xl"
                  animate={
                    principle.status === 'active'
                      ? {
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {principle.icon}
                </motion.div>

                {principle.status === 'active' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : principle.status === 'pending' ? (
                  <Clock className="w-5 h-5 text-orange-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-400" />
                )}
              </div>

              <h4 className={`text-xl font-bold ${principle.color} mb-1`}>{principle.name}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Batch {principle.batch}
              </p>

              {showDetails && (
                <>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span
                        className={`font-semibold ${
                          principle.status === 'active'
                            ? 'text-green-600 dark:text-green-400'
                            : principle.status === 'pending'
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {principle.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Flyers:</span>
                      <span className={`font-semibold ${principle.color}`}>
                        {principle.flyerCount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment:</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                        {principle.payment}
                      </span>
                    </div>
                  </div>

                  {principle.status === 'active' && (
                    <motion.div
                      className="mt-3 flex items-center gap-2"
                      variants={pulseVariants}
                      animate="pulse"
                    >
                      <div
                        className={
                          principle.name === 'TRUTH'
                            ? 'w-2 h-2 rounded-full bg-yellow-600 dark:bg-yellow-400'
                            : principle.name === 'BEAUTY'
                              ? 'w-2 h-2 rounded-full bg-pink-600 dark:bg-pink-400'
                              : 'w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400'
                        }
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        PulseGlow™ Active
                      </span>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Z-WCT Monitoring Status */}
        <motion.div
          className="mt-6 p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">🐍👁️</div>
            <div>
              <h4 className="font-semibold text-red-700 dark:text-red-400">
                Z-WCT Monitoring Active
              </h4>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Zero-Waste Collapse Theory • Rhino Strike Detection • Looking Beyond the Trunk
              </p>
            </div>
            <motion.div
              className="ml-auto w-3 h-3 rounded-full bg-green-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* Fruitful Drive Scooter Engine Status */}
        <motion.div
          className="mt-4 p-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🦊</div>
              <div>
                <h4 className="font-semibold">Fruitful Drive Scooter Engine</h4>
                <p className="text-xs text-gray-300 mt-1">"The fox doesn't speak — it routes."</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-400">REFUEL STOP #2</div>
              <p className="text-xs text-gray-400">Batch 3 Next</p>
            </div>
          </div>
        </motion.div>

        {/* X-Point Monitoring Status */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <motion.div
            className="w-2 h-2 rounded-full bg-blue-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
            }}
          />
          <span>X-Point Monitoring: Continuous</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default AirshowMetrics;
