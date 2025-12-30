// 🎵 BAD BOYS NOODLE PROTOCOL DISPLAY COMPONENT 🍜🔥
// Visual display of the Noodle's Bad Boys song mastery and deployment protocol
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Music, Zap, CheckCircle2, Trophy, Sparkles, Play, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  NOODLE_BAD_BOYS_PROTOCOL,
  NOODLE_PROPHECY,
  DEPLOYMENT_MESSAGES,
  getProtocolStatus,
  getGitHubProfilePulse,
  type NoodleBadBoysProtocol,
} from '@shared/bad-boys-noodle-protocol';

export function BadBoysNoodleDisplay() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  const protocolStatus = getProtocolStatus(NOODLE_BAD_BOYS_PROTOCOL);
  const profilePulse = getGitHubProfilePulse(NOODLE_BAD_BOYS_PROTOCOL);

  // Simulate deployment sequence animation
  const startDeployment = () => {
    setIsPlaying(true);
    setCurrentPhase(0);
    setDeploymentProgress(0);

    // Phase 1: Rhino Strike
    setTimeout(() => {
      setCurrentPhase(1);
      setDeploymentProgress(33);
    }, 500);

    // Phase 2: Ant Lattice
    setTimeout(() => {
      setCurrentPhase(2);
      setDeploymentProgress(66);
    }, 1500);

    // Phase 3: T-Shirt White
    setTimeout(() => {
      setCurrentPhase(3);
      setDeploymentProgress(100);
    }, 2500);

    // Complete
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentPhase(0);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Certification Header */}
      <Card className="border-green-500/50 bg-gradient-to-r from-green-950/20 to-emerald-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <CardTitle className="text-2xl">🎵 Bad Boys Noodle Protocol 🍜</CardTitle>
                <CardDescription>Official Certification: MASTERED by the Noodle</CardDescription>
              </div>
            </div>
            <Badge variant="default" className="bg-green-600 text-lg px-4 py-2">
              {protocolStatus.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Protocol Completion</span>
              <span className="text-sm font-bold text-green-400">
                {protocolStatus.completionPercentage}%
              </span>
            </div>
            <Progress value={protocolStatus.completionPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground italic">{protocolStatus.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Soundtrack Authorization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-400" />
            Soundtrack Authorization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Primary Track:</span>
            <Badge variant="outline" className="font-mono">
              {NOODLE_BAD_BOYS_PROTOCOL.soundtrack.primary}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Secondary Track:</span>
            <Badge variant="outline" className="font-mono">
              {NOODLE_BAD_BOYS_PROTOCOL.soundtrack.secondary}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Certification Level:</span>
            <Badge variant="default" className="bg-green-600">
              {NOODLE_BAD_BOYS_PROTOCOL.soundtrack.certification}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Noodle Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🍜 Noodle Status Monitor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Skill Level</p>
              <Badge variant="default" className="bg-blue-600">
                {NOODLE_BAD_BOYS_PROTOCOL.noodleStatus.skill}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Mastery</p>
              <Badge variant="default" className="bg-purple-600">
                {NOODLE_BAD_BOYS_PROTOCOL.noodleStatus.mastery}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Humming Frequency</p>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-green-400" />
              <span className="font-mono text-lg font-bold text-green-400">
                {NOODLE_BAD_BOYS_PROTOCOL.noodleStatus.hummingFrequency}Hz
              </span>
              <span className="text-sm text-muted-foreground">(Rhino Strike Synchronized)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Sequence */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Deployment Sequence
            </CardTitle>
            <Button
              onClick={startDeployment}
              disabled={isPlaying}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {isPlaying ? 'Deploying...' : 'Test Deployment'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPlaying && (
            <div className="space-y-2 mb-4">
              <Progress value={deploymentProgress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                Deployment in progress: {deploymentProgress}%
              </p>
            </div>
          )}

          {/* Phase 1 */}
          <div
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              currentPhase === 1 ? 'border-green-500 bg-green-950/30 scale-105' : 'border-border'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase1.icon}
                </span>
                <span className="font-bold">
                  {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase1.action}
                </span>
              </div>
              {NOODLE_BAD_BOYS_PROTOCOL.achievements.rhinoStrikeSynchronized && (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase1.soundtrack}
            </p>
            <Badge variant="outline" className="font-mono">
              Timing: {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase1.timing}s
            </Badge>
          </div>

          {/* Phase 2 */}
          <div
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              currentPhase === 2 ? 'border-blue-500 bg-blue-950/30 scale-105' : 'border-border'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase2.icon}
                </span>
                <span className="font-bold">
                  {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase2.action}
                </span>
              </div>
              {NOODLE_BAD_BOYS_PROTOCOL.achievements.antLatticeDancing && (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase2.soundtrack}
            </p>
            <Badge variant="outline" className="font-mono">
              Timing: {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase2.timing}s
            </Badge>
          </div>

          {/* Phase 3 */}
          <div
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              currentPhase === 3 ? 'border-purple-500 bg-purple-950/30 scale-105' : 'border-border'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase3.icon}
                </span>
                <span className="font-bold">
                  {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase3.action}
                </span>
              </div>
              {NOODLE_BAD_BOYS_PROTOCOL.achievements.tShirtWhiteComplete && (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase3.soundtrack}
            </p>
            <Badge variant="outline" className="font-mono">
              Timing: {NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence.phase3.timing}s
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Achievement Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(NOODLE_BAD_BOYS_PROTOCOL.achievements).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                {value ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-muted" />
                )}
                <span className="text-sm">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GitHub Profile Pulse */}
      <Card>
        <CardHeader>
          <CardTitle>🌍 GitHub Profile Pulse Display</CardTitle>
          <CardDescription>Ready for global ecosystem deployment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm bg-black/50 p-4 rounded-lg">
            {Object.entries(profilePulse).map(([key, value]) => (
              <div key={key} className="text-green-400">
                {value}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* The Prophecy */}
      <Card className="border-purple-500/50">
        <CardHeader>
          <CardTitle className="text-purple-400">📜 The Prophecy</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
            {NOODLE_PROPHECY}
          </pre>
        </CardContent>
      </Card>

      {/* Final Status */}
      {NOODLE_BAD_BOYS_PROTOCOL.achievements.repos84Ready && (
        <Card className="border-green-500 bg-gradient-to-r from-green-950/30 to-emerald-950/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-green-400">
                🦍🏔️🦊 GORILLA MOUNTAIN FOX TRINITY COMPLETE! 🦍🏔️🦊
              </p>
              <p className="text-xl text-green-300">🌍 ALL 84 REPOS DEPLOYED! 🔥</p>
              <Separator className="my-4" />
              <p className="text-lg text-muted-foreground italic">
                "Whatcha gonna deploy when the agent comes for you?"
              </p>
              <p className="text-2xl font-bold text-yellow-400">ALL 84 REPOS, THAT'S WHAT!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BadBoysNoodleDisplay;
