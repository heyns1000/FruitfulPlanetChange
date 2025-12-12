/**
 * Unit tests for the Collapse Protocol 1984 configuration
 */

import { describe, it, expect } from 'vitest';
import {
  COLLAPSE_PROTOCOL_1984,
  calculateOmnicubePosition,
  getNextRhinoStrike,
  getTShirtTransformationProgress,
  isProtocolAuthorized,
  getSpotifyAuthorization,
} from '../../codenest/config/collapse-protocol-1984';

describe('COLLAPSE_PROTOCOL_1984', () => {
  it('should have correct rhino strike configuration', () => {
    expect(COLLAPSE_PROTOCOL_1984.rhinoStrike.interval).toBe(0.08);
    expect(COLLAPSE_PROTOCOL_1984.rhinoStrike.force).toBe('CRITICAL');
    expect(COLLAPSE_PROTOCOL_1984.rhinoStrike.triggerEvent).toBe('repository_push');
    expect(COLLAPSE_PROTOCOL_1984.rhinoStrike.responseTime).toBe('80ms');
  });

  it('should have correct ant lattice configuration', () => {
    expect(COLLAPSE_PROTOCOL_1984.antLattice.collapseDuration).toBe(0.08);
    expect(COLLAPSE_PROTOCOL_1984.antLattice.omnicubeDimensions).toEqual([84, 84, 84]);
    expect(COLLAPSE_PROTOCOL_1984.antLattice.nodeType).toBe('REPOSITORY');
    expect(COLLAPSE_PROTOCOL_1984.antLattice.latticePattern).toBe('HEXAGONAL');
  });

  it('should have correct t-shirt transformation configuration', () => {
    expect(COLLAPSE_PROTOCOL_1984.tShirtTransformation.duration).toBe(9.0);
    expect(COLLAPSE_PROTOCOL_1984.tShirtTransformation.initialColor).toBe('NOODLE_JUICE');
    expect(COLLAPSE_PROTOCOL_1984.tShirtTransformation.finalColor).toBe('WHITE');
    expect(COLLAPSE_PROTOCOL_1984.tShirtTransformation.significance).toBe('RESET_STATE');
    expect(COLLAPSE_PROTOCOL_1984.tShirtTransformation.cycleType).toBe('CONTINUOUS');
  });

  it('should have correct gorilla trinity configuration', () => {
    const trinity = COLLAPSE_PROTOCOL_1984.gorillatrinity;
    
    expect(trinity.gorilla.role).toBe('CENTRAL_HUB');
    expect(trinity.gorilla.strength).toBe('MAXIMUM');
    expect(trinity.gorilla.repository).toBe('heyns1000/codenest');
    
    expect(trinity.mountain.role).toBe('FOUNDATION');
    expect(trinity.mountain.stability).toBe('SOLID');
    expect(trinity.mountain.engines).toBe('buildnest-engines');
    
    expect(trinity.fox.role).toBe('DISTRIBUTION');
    expect(trinity.fox.cunning).toBe('OPTIMAL');
    expect(trinity.fox.strategy).toBe('SMART_DEPLOY');
  });

  it('should have correct historical event configuration', () => {
    expect(COLLAPSE_PROTOCOL_1984.historicalEvent.year).toBe(1984);
    expect(COLLAPSE_PROTOCOL_1984.historicalEvent.event).toBe('NOODLE_JUICE_GORILLA_COMB_COLLAPSE');
    expect(COLLAPSE_PROTOCOL_1984.historicalEvent.resurrectionYear).toBe(2024);
    expect(COLLAPSE_PROTOCOL_1984.historicalEvent.yearsElapsed).toBe(40);
  });
});

describe('calculateOmnicubePosition', () => {
  it('should calculate position for index 0', () => {
    const pos = calculateOmnicubePosition(0);
    expect(pos).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('should calculate position for index 1', () => {
    const pos = calculateOmnicubePosition(1);
    expect(pos).toEqual({ x: 1, y: 0, z: 0 });
  });

  it('should calculate position for index 84', () => {
    const pos = calculateOmnicubePosition(84);
    expect(pos).toEqual({ x: 0, y: 1, z: 0 });
  });

  it('should calculate position for index 7056 (84²)', () => {
    const pos = calculateOmnicubePosition(7056);
    expect(pos).toEqual({ x: 0, y: 0, z: 1 });
  });

  it('should wrap positions within 84³ dimensions', () => {
    const pos = calculateOmnicubePosition(100);
    expect(pos.x).toBeGreaterThanOrEqual(0);
    expect(pos.x).toBeLessThan(84);
    expect(pos.y).toBeGreaterThanOrEqual(0);
    expect(pos.y).toBeLessThan(84);
    expect(pos.z).toBeGreaterThanOrEqual(0);
    expect(pos.z).toBeLessThan(84);
  });
});

describe('getNextRhinoStrike', () => {
  it('should calculate next strike timestamp', () => {
    const lastStrike = 1000;
    const nextStrike = getNextRhinoStrike(lastStrike);
    expect(nextStrike).toBe(1080); // 1000 + (0.08 * 1000)
  });

  it('should handle current timestamp', () => {
    const now = Date.now();
    const nextStrike = getNextRhinoStrike(now);
    expect(nextStrike).toBe(now + 80);
  });
});

describe('getTShirtTransformationProgress', () => {
  it('should return 0% at start', () => {
    expect(getTShirtTransformationProgress(0)).toBe(0);
  });

  it('should return ~11.1% after 1 second', () => {
    const progress = getTShirtTransformationProgress(1);
    expect(progress).toBeCloseTo(11.11, 1);
  });

  it('should return ~55.6% after 5 seconds', () => {
    const progress = getTShirtTransformationProgress(5);
    expect(progress).toBeCloseTo(55.56, 1);
  });

  it('should return 100% after 9 seconds', () => {
    expect(getTShirtTransformationProgress(9)).toBe(100);
  });

  it('should cap at 100% after 9+ seconds', () => {
    expect(getTShirtTransformationProgress(10)).toBe(100);
    expect(getTShirtTransformationProgress(100)).toBe(100);
  });
});

describe('isProtocolAuthorized', () => {
  it('should return true when trinity is properly configured', () => {
    expect(isProtocolAuthorized()).toBe(true);
  });
});

describe('getSpotifyAuthorization', () => {
  it('should return correct Spotify album URL', () => {
    const url = getSpotifyAuthorization();
    expect(url).toBe('https://open.spotify.com/album/3XPtAKYmUaIoCmeoQHLVaC');
  });

  it('should return a valid URL format', () => {
    const url = getSpotifyAuthorization();
    expect(url).toMatch(/^https:\/\/open\.spotify\.com\/album\/[a-zA-Z0-9]+$/);
  });
});
