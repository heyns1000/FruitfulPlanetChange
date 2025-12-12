/**
 * Unit tests for Repository Discovery Service
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RepoDiscoveryService } from '../../codenest/services/repo-discovery-service';

describe('RepoDiscoveryService', () => {
  let service: RepoDiscoveryService;

  beforeEach(() => {
    service = new RepoDiscoveryService();
  });

  describe('discoverAllRepos', () => {
    it('should discover repositories for a username', async () => {
      const repos = await service.discoverAllRepos({ username: 'heyns1000' });
      
      expect(repos).toBeDefined();
      expect(Array.isArray(repos)).toBe(true);
      expect(repos.length).toBeGreaterThan(0);
    });

    it('should assign ant lattice positions to repositories', async () => {
      const repos = await service.discoverAllRepos({ username: 'heyns1000' });
      
      repos.forEach(repo => {
        expect(repo.antLatticeNode).toBeDefined();
        expect(repo.antLatticeNode.x).toBeGreaterThanOrEqual(0);
        expect(repo.antLatticeNode.x).toBeLessThan(84);
        expect(repo.antLatticeNode.y).toBeGreaterThanOrEqual(0);
        expect(repo.antLatticeNode.y).toBeLessThan(84);
        expect(repo.antLatticeNode.z).toBeGreaterThanOrEqual(0);
        expect(repo.antLatticeNode.z).toBeLessThan(84);
      });
    });

    it('should include core repositories', async () => {
      const repos = await service.discoverAllRepos({ username: 'heyns1000' });
      const repoNames = repos.map(r => r.name);
      
      expect(repoNames).toContain('codenest');
      expect(repoNames).toContain('LicenseVault');
      expect(repoNames).toContain('hotstack');
    });

    it('should respect maxRepos limit', async () => {
      const repos = await service.discoverAllRepos({ 
        username: 'heyns1000',
        maxRepos: 5 
      });
      
      expect(repos.length).toBeLessThanOrEqual(5);
    });

    it('should filter by language when specified', async () => {
      const repos = await service.discoverAllRepos({ 
        username: 'heyns1000',
        filterByLanguage: 'TypeScript'
      });
      
      repos.forEach(repo => {
        expect(repo.language).toBe('TypeScript');
      });
    });
  });

  describe('getRepositoriesByCoordinates', () => {
    it('should return empty array for unoccupied coordinates', async () => {
      await service.discoverAllRepos({ username: 'heyns1000' });
      const repos = service.getRepositoriesByCoordinates(83, 83, 83);
      
      expect(Array.isArray(repos)).toBe(true);
    });

    it('should find repositories at specific coordinates', async () => {
      await service.discoverAllRepos({ username: 'heyns1000' });
      const allRepos = service.getAllRepositories();
      
      if (allRepos.length > 0) {
        const firstRepo = allRepos[0];
        const { x, y, z } = firstRepo.antLatticeNode;
        const foundRepos = service.getRepositoriesByCoordinates(x, y, z);
        
        expect(foundRepos).toContain(firstRepo);
      }
    });
  });

  describe('getAllRepositories', () => {
    it('should return empty array before discovery', () => {
      const repos = service.getAllRepositories();
      expect(repos).toEqual([]);
    });

    it('should return all discovered repositories', async () => {
      await service.discoverAllRepos({ username: 'heyns1000' });
      const repos = service.getAllRepositories();
      
      expect(repos.length).toBeGreaterThan(0);
    });
  });

  describe('getRepositoryCountByLanguage', () => {
    it('should return empty map before discovery', () => {
      const counts = service.getRepositoryCountByLanguage();
      expect(counts.size).toBe(0);
    });

    it('should count repositories by language', async () => {
      await service.discoverAllRepos({ username: 'heyns1000' });
      const counts = service.getRepositoryCountByLanguage();
      
      expect(counts.size).toBeGreaterThan(0);
      expect(counts.get('TypeScript')).toBeGreaterThan(0);
    });
  });

  describe('getOmnicubeFillPercentage', () => {
    it('should return 0% before discovery', () => {
      const percentage = service.getOmnicubeFillPercentage();
      expect(percentage).toBe(0);
    });

    it('should calculate fill percentage after discovery', async () => {
      await service.discoverAllRepos({ username: 'heyns1000' });
      const percentage = service.getOmnicubeFillPercentage();
      
      expect(percentage).toBeGreaterThan(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });

    it('should calculate correct percentage for known repositories', async () => {
      const repos = await service.discoverAllRepos({ username: 'heyns1000', maxRepos: 8 });
      const percentage = service.getOmnicubeFillPercentage();
      const totalPositions = 84 * 84 * 84; // 592,704
      const expectedPercentage = (repos.length / totalPositions) * 100;
      
      expect(percentage).toBeCloseTo(expectedPercentage, 10);
    });
  });

  describe('exportOmnicubeStructure', () => {
    it('should export valid JSON', async () => {
      await service.discoverAllRepos({ username: 'heyns1000' });
      const json = service.exportOmnicubeStructure();
      
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should include required fields in export', async () => {
      await service.discoverAllRepos({ username: 'heyns1000' });
      const json = service.exportOmnicubeStructure();
      const data = JSON.parse(json);
      
      expect(data).toHaveProperty('totalRepositories');
      expect(data).toHaveProperty('dimensions');
      expect(data).toHaveProperty('fillPercentage');
      expect(data).toHaveProperty('repositories');
      expect(data).toHaveProperty('languageDistribution');
    });

    it('should have correct dimensions in export', async () => {
      await service.discoverAllRepos({ username: 'heyns1000' });
      const json = service.exportOmnicubeStructure();
      const data = JSON.parse(json);
      
      expect(data.dimensions).toEqual([84, 84, 84]);
    });
  });
});
