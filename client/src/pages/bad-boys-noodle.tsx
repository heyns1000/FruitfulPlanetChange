import { motion } from 'framer-motion';
import { Music, Trophy, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BadBoysNoodleDisplay } from '@/components/portal/bad-boys-noodle-display';

export default function BadBoysNoodlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center gap-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
            <Music className="w-16 h-16 text-purple-500" />
            <Zap className="w-16 h-16 text-green-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
            🎵 Bad Boys Noodle Protocol 🍜
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            The Noodle has mastered the Bad Boys song and is hereby authorized to execute the
            complete 1984 Collapse Protocol with full Rhino Strike precision
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="default" className="bg-green-600 text-lg px-6 py-2">
              🎵 Musical Authorization: GRANTED
            </Badge>
            <Badge variant="default" className="bg-purple-600 text-lg px-6 py-2">
              🍜 Noodle Status: MASTERED
            </Badge>
            <Badge variant="default" className="bg-yellow-600 text-lg px-6 py-2">
              🦏 Rhino Strike: CERTIFIED
            </Badge>
          </div>
        </div>

        {/* Certificate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-12"
        >
          <Card className="border-4 border-green-500/50 bg-gradient-to-br from-green-950/50 to-emerald-950/50 shadow-2xl">
            <CardContent className="p-8">
              <pre className="text-sm md:text-base text-green-300 font-mono whitespace-pre-wrap overflow-x-auto">
                {`╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        🦍🦏⚡ OFFICIAL CERTIFICATION RECOGNIZED ⚡🐜🔷         ║
║                                                                ║
║  The Noodle has successfully mastered the "Bad Boys" song     ║
║  and is hereby authorized to execute the complete             ║
║  1984 Collapse Protocol with full Rhino Strike precision     ║
║                                                                ║
║  🎵 Musical Authorization:  GRANTED                            ║
║  🍜 Noodle Status: BAD BOYS HUMMING MASTERED                 ║
║  🦏 Rhino Strike Approval: CERTIFIED                          ║
║  🐜 Ant Lattice Clearance: APPROVED                           ║
║                                                                ║
║  Authorized by: Gorilla Mountain Fox 🦍🏔️🦊                  ║
║  Soundtrack: Bad Boys (Noodle Remix) 🎶                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝`}
              </pre>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Protocol Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <BadBoysNoodleDisplay />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="border-yellow-500/50 bg-gradient-to-r from-yellow-950/30 to-amber-950/30">
            <CardHeader>
              <CardTitle className="text-yellow-400">🦍🏔️🦊 Gorilla Mountain Fox Trinity</CardTitle>
              <CardDescription className="text-lg">
                Approved by the soundtrack - Ready for 84-repository integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-300 mb-2">
                "Whatcha gonna deploy when the agent comes for you?"
              </p>
              <p className="text-3xl font-bold text-green-400">ALL 84 REPOS, THAT'S WHAT! 🌍🔥</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
