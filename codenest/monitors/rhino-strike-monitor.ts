/**
 * 🦏⚡ Rhino Strike Monitor
 * 
 * Monitors for Rhino Strikes at 0.08-second intervals
 * Triggers Ant Lattice Omnicube cascade and T-Shirt transformation
 * Part of the Gorilla Mountain Fox Protocol
 */

import { COLLAPSE_PROTOCOL_1984, getNextRhinoStrike, getTShirtTransformationProgress } from '../config/collapse-protocol-1984';

export interface RhinoStrikeEvent {
  timestamp: number;
  force: 'CRITICAL' | 'MODERATE' | 'LOW';
  cascadeTriggered: boolean;
  transformationStarted: boolean;
}

export interface MonitoringStats {
  totalStrikes: number;
  lastStrikeTime: number;
  nextStrikeTime: number;
  cascadesTriggered: number;
  transformationsCompleted: number;
  uptime: number;
}

/**
 * Rhino Strike Monitor
 * Monitors system for Rhino Strike events at precise 0.08s intervals
 */
export class RhinoStrikeMonitor {
  private readonly STRIKE_INTERVAL: number;
  private isMonitoring: boolean = false;
  private intervalId?: NodeJS.Timeout;
  private stats: MonitoringStats;
  private strikeHistory: RhinoStrikeEvent[] = [];
  private startTime: number = 0;

  constructor() {
    this.STRIKE_INTERVAL = COLLAPSE_PROTOCOL_1984.rhinoStrike.interval; // 0.08 seconds
    this.stats = {
      totalStrikes: 0,
      lastStrikeTime: 0,
      nextStrikeTime: 0,
      cascadesTriggered: 0,
      transformationsCompleted: 0,
      uptime: 0,
    };
  }

  /**
   * Start monitoring for Rhino Strikes
   */
  async monitorForStrikes(): Promise<void> {
    if (this.isMonitoring) {
      console.log('⚠️ Monitor already running');
      return;
    }

    this.isMonitoring = true;
    this.startTime = Date.now();
    console.log('🦏 Starting Rhino Strike Monitor');
    console.log(`⏱️ Monitoring interval: ${this.STRIKE_INTERVAL * 1000}ms`);

    this.intervalId = setInterval(async () => {
      const strike = await this.detectRhinoStrike();
      if (strike) {
        await this.handleRhinoStrike(strike);
      }
    }, this.STRIKE_INTERVAL * 1000);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.isMonitoring = false;
    console.log('🛑 Rhino Strike Monitor stopped');
  }

  /**
   * Detect if a Rhino Strike has occurred
   * @returns Strike event or null
   */
  private async detectRhinoStrike(): Promise<RhinoStrikeEvent | null> {
    // In production, this would check for actual trigger events
    // For now, we simulate strike detection
    const shouldStrike = Math.random() > 0.95; // 5% chance per interval

    if (shouldStrike) {
      return {
        timestamp: Date.now(),
        force: COLLAPSE_PROTOCOL_1984.rhinoStrike.force,
        cascadeTriggered: false,
        transformationStarted: false,
      };
    }

    return null;
  }

  /**
   * Handle a detected Rhino Strike
   * @param strike The strike event
   */
  private async handleRhinoStrike(strike: RhinoStrikeEvent): Promise<void> {
    console.log('🦏⚡ RHINO STRIKE DETECTED');
    console.log(`Force: ${strike.force}`);
    console.log(`Timestamp: ${new Date(strike.timestamp).toISOString()}`);

    this.stats.totalStrikes++;
    this.stats.lastStrikeTime = strike.timestamp;
    this.stats.nextStrikeTime = getNextRhinoStrike(strike.timestamp);

    // Trigger Ant Lattice Cascade
    await this.triggerAntLatticeCascade();
    strike.cascadeTriggered = true;

    // Initiate T-Shirt Transformation
    await this.initiateTShirtTransformation();
    strike.transformationStarted = true;

    // Add to history
    this.strikeHistory.push(strike);
    if (this.strikeHistory.length > 100) {
      this.strikeHistory.shift(); // Keep last 100 strikes
    }
  }

  /**
   * Trigger Ant Lattice Omnicube cascade
   */
  private async triggerAntLatticeCascade(): Promise<void> {
    console.log('🐜 Initiating Ant Lattice Omnicube cascade...');
    console.log(`🔷 Dimensions: ${COLLAPSE_PROTOCOL_1984.antLattice.omnicubeDimensions.join('×')}`);
    console.log(`⏱️ Collapse duration: ${COLLAPSE_PROTOCOL_1984.antLattice.collapseDuration}s`);

    // 0.08 second cascade window
    await this.sleep(COLLAPSE_PROTOCOL_1984.antLattice.collapseDuration);

    console.log('🔷 Omnicube cascade complete');
    this.stats.cascadesTriggered++;
  }

  /**
   * Initiate T-Shirt transformation cycle
   */
  private async initiateTShirtTransformation(): Promise<void> {
    const duration = COLLAPSE_PROTOCOL_1984.tShirtTransformation.duration;
    console.log(`👕 Starting ${duration}-second T-Shirt transformation...`);
    console.log(`🌊 Color: ${COLLAPSE_PROTOCOL_1984.tShirtTransformation.initialColor} → ${COLLAPSE_PROTOCOL_1984.tShirtTransformation.finalColor}`);

    for (let i = 1; i <= duration; i++) {
      const progress = getTShirtTransformationProgress(i);
      console.log(`Second ${i}/${duration}: Draining Noodle Juice... (${progress.toFixed(1)}% complete)`);
      await this.sleep(1);
    }

    console.log('⚪ T-SHIRT NOW WHITE - RESET COMPLETE');
    this.stats.transformationsCompleted++;
  }

  /**
   * Sleep utility
   * @param seconds Number of seconds to sleep
   */
  private sleep(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  /**
   * Get monitoring statistics
   * @returns Current stats
   */
  getStats(): MonitoringStats {
    this.stats.uptime = this.startTime ? Date.now() - this.startTime : 0;
    return { ...this.stats };
  }

  /**
   * Get strike history
   * @param limit Maximum number of strikes to return
   * @returns Recent strikes
   */
  getStrikeHistory(limit: number = 10): RhinoStrikeEvent[] {
    return this.strikeHistory.slice(-limit);
  }

  /**
   * Check if monitor is running
   * @returns Monitoring status
   */
  isRunning(): boolean {
    return this.isMonitoring;
  }

  /**
   * Get time until next expected strike
   * @returns Milliseconds until next strike
   */
  getTimeUntilNextStrike(): number {
    if (!this.stats.lastStrikeTime) {
      return this.STRIKE_INTERVAL * 1000;
    }
    const nextStrike = getNextRhinoStrike(this.stats.lastStrikeTime);
    return Math.max(0, nextStrike - Date.now());
  }
}

/**
 * Create a singleton instance of the monitor
 */
export const rhinoStrikeMonitor = new RhinoStrikeMonitor();
