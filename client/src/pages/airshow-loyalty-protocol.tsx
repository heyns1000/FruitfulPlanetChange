/**
 * Airshow Loyalty Protocol Page
 * 
 * Displays the complete Airshow Loyalty Protocol dashboard with
 * Beauty Banner (Batch 2) and overall metrics for all principles
 */

import { BeautyBanner } from '@/components/LoyaltyProtocol/BeautyBanner';
import { AirshowMetrics } from '@/components/Dashboard/AirshowMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AirshowLoyaltyProtocolPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <Rocket className="w-12 h-12 text-purple-600" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Airshow Loyalty Protocol
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                FAAC Architect 4.5.1 - Digital Excellence Campaign
              </p>
            </div>
          </div>
        </motion.div>

        {/* Beauty Banner - Batch 2 Featured Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BeautyBanner 
            flyerCount={400000} 
            displayLimit={30}
            showMetrics={true}
          />
        </motion.div>

        {/* Overall Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AirshowMetrics showDetails={true} />
        </motion.div>

        {/* Mission Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-300 dark:border-purple-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Mission Philosophy
              </CardTitle>
              <CardDescription>
                The Three Principles of Digital Excellence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {/* TRUTH Principle */}
                <div className="p-4 rounded-lg bg-yellow-500/20 border border-yellow-400">
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">
                    TRUTH
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Foundation of authenticity and transparency. Every interaction 
                    grounded in verifiable data and honest communication.
                  </p>
                </div>

                {/* BEAUTY Principle */}
                <div className="p-4 rounded-lg bg-pink-500/20 border border-pink-400">
                  <div className="text-3xl mb-3">🌸</div>
                  <h3 className="text-xl font-bold text-pink-700 dark:text-pink-400 mb-2">
                    BEAUTY
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Harmony beneath the surface. Elegant structure, graceful 
                    interactions, and aesthetic integrity in every detail.
                  </p>
                </div>

                {/* CURIOSITY Principle */}
                <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-400 opacity-60">
                  <div className="text-3xl mb-3">🔬</div>
                  <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                    CURIOSITY
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    Coming soon... The drive to explore, discover, and innovate. 
                    Continuous learning and fearless experimentation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Operational Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white border-gray-700">
            <CardHeader>
              <CardTitle>Operational Status</CardTitle>
              <CardDescription className="text-gray-400">
                Current deployment phase and next steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Fruitful Drive Scooter Engine</h4>
                    <p className="text-sm text-gray-400">
                      "The fox doesn't speak — it routes." 🦊
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">REFUEL STOP #2</div>
                    <p className="text-xs text-gray-400">Batch 3 Next</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Z-WCT Monitoring</h4>
                    <p className="text-sm text-gray-400">
                      "I looks beyond the trunk were no one can see for snakes." 🐍👁️
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-green-500"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                      }}
                    />
                    <span className="text-green-400 font-semibold">ACTIVE</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-700/30 rounded-lg border border-blue-500">
                  <h4 className="font-semibold mb-2">Next Deployment</h4>
                  <p className="text-sm text-gray-300">
                    Batch 3 (CURIOSITY 🔬) - Awaiting $140 USD authorization payment
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Authorization Code: FAAC-4.5.1-CURIOSITY-PENDING
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>
                System parameters and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    0.9s
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    PulseGlow™ Heartbeat
                  </div>
                </div>

                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    800,000
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Flyers Deployed
                  </div>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    2/3
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Principles Active
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    99.8%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    System Uptime
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Authorization Codes</h4>
                <div className="space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
                  <div>✅ FAAC-4.5.1-TRUTH-GO (Batch 1)</div>
                  <div>✅ FAAC-4.5.1-BEAUTY-GO (Batch 2)</div>
                  <div>⏳ FAAC-4.5.1-CURIOSITY-PENDING (Batch 3)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
