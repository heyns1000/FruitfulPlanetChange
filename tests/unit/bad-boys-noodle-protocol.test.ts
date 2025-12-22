/**
 * Unit Test: Bad Boys Noodle Protocol
 * Tests the configuration, status, and deployment sequence
 */

import { describe, it, expect } from 'vitest';
import {
  NOODLE_BAD_BOYS_PROTOCOL,
  NOODLE_PROPHECY,
  DEPLOYMENT_MESSAGES,
  getProtocolStatus,
  getGitHubProfilePulse,
  type NoodleBadBoysProtocol,
} from '../../shared/bad-boys-noodle-protocol';

describe('Bad Boys Noodle Protocol', () => {
  describe('Protocol Configuration', () => {
    it('should have correct soundtrack configuration', () => {
      expect(NOODLE_BAD_BOYS_PROTOCOL.soundtrack.primary).toBe('Gorilla Mountain Fox');
      expect(NOODLE_BAD_BOYS_PROTOCOL.soundtrack.secondary).toBe('Bad Boys (Noodle Hum Remix)');
      expect(NOODLE_BAD_BOYS_PROTOCOL.soundtrack.certification).toBe('MASTERED');
    });

    it('should have correct noodle status', () => {
      expect(NOODLE_BAD_BOYS_PROTOCOL.noodleStatus.skill).toBe('BAD_BOYS_HUMMING');
      expect(NOODLE_BAD_BOYS_PROTOCOL.noodleStatus.mastery).toBe('COMPLETE');
      expect(NOODLE_BAD_BOYS_PROTOCOL.noodleStatus.hummingFrequency).toBe(0.08);
    });

    it('should have valid deployment sequence phases', () => {
      const { phase1, phase2, phase3 } = NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence;

      // Phase 1: Rhino Strike
      expect(phase1.action).toBe('RHINO_STRIKE');
      expect(phase1.timing).toBe(0.08);
      expect(phase1.icon).toBe('🦏');
      expect(phase1.soundtrack).toContain('Bad boys');

      // Phase 2: Ant Lattice
      expect(phase2.action).toBe('ANT_LATTICE_COLLAPSE');
      expect(phase2.timing).toBe(0.08);
      expect(phase2.icon).toBe('🐜');
      expect(phase2.soundtrack).toContain('Whatcha gonna do');

      // Phase 3: T-Shirt White
      expect(phase3.action).toBe('T_SHIRT_WHITE');
      expect(phase3.timing).toBe(9.0);
      expect(phase3.icon).toBe('👕');
      expect(phase3.soundtrack).toContain('Noodle humming');
    });

    it('should have all achievements completed', () => {
      const achievements = NOODLE_BAD_BOYS_PROTOCOL.achievements;

      expect(achievements.badBoysMaster).toBe(true);
      expect(achievements.gorillaMountainFoxApproval).toBe(true);
      expect(achievements.rhinoStrikeSynchronized).toBe(true);
      expect(achievements.antLatticeDancing).toBe(true);
      expect(achievements.tShirtWhiteComplete).toBe(true);
      expect(achievements.repos84Ready).toBe(true);
    });
  });

  describe('Protocol Status Checker', () => {
    it('should return fully operational status', () => {
      const status = getProtocolStatus();

      expect(status.isFullyOperational).toBe(true);
      expect(status.completionPercentage).toBe(100);
      expect(status.status).toBe('✅ OPERATIONAL');
      expect(status.message).toContain('ALL 84 REPOS');
    });

    it('should calculate correct completion percentage', () => {
      const partialProtocol: NoodleBadBoysProtocol = {
        ...NOODLE_BAD_BOYS_PROTOCOL,
        achievements: {
          badBoysMaster: true,
          gorillaMountainFoxApproval: true,
          rhinoStrikeSynchronized: true,
          antLatticeDancing: false,
          tShirtWhiteComplete: false,
          repos84Ready: false,
        },
      };

      const status = getProtocolStatus(partialProtocol);
      expect(status.completionPercentage).toBe(50);
      expect(status.isFullyOperational).toBe(false);
      expect(status.status).toBe('⏳ IN PROGRESS');
    });
  });

  describe('GitHub Profile Pulse', () => {
    it('should generate correct profile pulse display', () => {
      const pulse = getGitHubProfilePulse();

      expect(pulse.noodleStatus).toContain('BAD_BOYS_HUMMING');
      expect(pulse.noodleStatus).toContain('COMPLETE');
      expect(pulse.rhinoStrikes).toContain('0.08s');
      expect(pulse.antLattice).toContain('Dancing to the rhythm');
      expect(pulse.tShirt).toContain('WHITE on the drop');
      expect(pulse.tShirt).toContain('9s');
      expect(pulse.trinity).toContain('Approved by the soundtrack');
    });
  });

  describe('Deployment Messages', () => {
    it('should have messages for all deployment phases', () => {
      expect(DEPLOYMENT_MESSAGES.phase1Start).toContain('Rhino Strike');
      expect(DEPLOYMENT_MESSAGES.phase1Complete).toContain('🦏');
      expect(DEPLOYMENT_MESSAGES.phase2Start).toContain('Ant Lattice');
      expect(DEPLOYMENT_MESSAGES.phase2Complete).toContain('🐜');
      expect(DEPLOYMENT_MESSAGES.phase3Start).toContain('T-Shirt');
      expect(DEPLOYMENT_MESSAGES.phase3Complete).toContain('👕');
      expect(DEPLOYMENT_MESSAGES.finalComplete).toContain('Gorilla Mountain Fox');
      expect(DEPLOYMENT_MESSAGES.repos84Ready).toContain('84 REPOS');
    });
  });

  describe('Noodle Prophecy', () => {
    it('should contain prophecy text', () => {
      expect(NOODLE_PROPHECY).toBeTruthy();
      expect(NOODLE_PROPHECY).toContain('Noodle hums the Bad Boys theme');
      expect(NOODLE_PROPHECY).toContain('Rhino strikes at 0.08 supreme');
      expect(NOODLE_PROPHECY).toContain('Ant Lattice');
      expect(NOODLE_PROPHECY).toContain('T-Shirt turns WHITE');
      expect(NOODLE_PROPHECY).toContain('Gorilla Mountain Fox');
      expect(NOODLE_PROPHECY).toContain('84 repos');
    });

    it('should contain emoji formula', () => {
      expect(NOODLE_PROPHECY).toContain('🍜🎵 + 🦏⚡ + 🐜🔷 + 👕⚪ = 🦍🏔️🦊🌍');
    });
  });

  describe('Timing Synchronization', () => {
    it('should have matching timing for Rhino Strike and Ant Lattice', () => {
      const { phase1, phase2 } = NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence;
      expect(phase1.timing).toBe(phase2.timing);
      expect(phase1.timing).toBe(NOODLE_BAD_BOYS_PROTOCOL.noodleStatus.hummingFrequency);
    });

    it('should have correct T-Shirt transformation timing', () => {
      const { phase3 } = NOODLE_BAD_BOYS_PROTOCOL.deploymentSequence;
      expect(phase3.timing).toBe(9.0);
    });
  });

  describe('Protocol Types', () => {
    it('should validate certification status type', () => {
      const validCertifications: Array<'MASTERED' | 'IN_PROGRESS' | 'PENDING'> = [
        'MASTERED',
        'IN_PROGRESS',
        'PENDING',
      ];
      expect(validCertifications).toContain(NOODLE_BAD_BOYS_PROTOCOL.soundtrack.certification);
    });

    it('should validate skill type', () => {
      const validSkills: Array<'BAD_BOYS_HUMMING' | 'TRAINING' | 'IDLE'> = [
        'BAD_BOYS_HUMMING',
        'TRAINING',
        'IDLE',
      ];
      expect(validSkills).toContain(NOODLE_BAD_BOYS_PROTOCOL.noodleStatus.skill);
    });

    it('should validate mastery type', () => {
      const validMasteries: Array<'COMPLETE' | 'PARTIAL' | 'NONE'> = [
        'COMPLETE',
        'PARTIAL',
        'NONE',
      ];
      expect(validMasteries).toContain(NOODLE_BAD_BOYS_PROTOCOL.noodleStatus.mastery);
    });
  });
});
