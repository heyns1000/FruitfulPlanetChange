import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface SyncStatus {
  isConnected: boolean;
  lastSync: string;
  syncCount: number;
  errors: string[];
}

export function useGlobalSync() {
  const queryClient = useQueryClient();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: true,
    lastSync: new Date().toISOString(),
    syncCount: 0,
    errors: []
  });

  // Global sync for all critical data endpoints
  const syncEndpoints = [
    '/api/sectors',
    '/api/brands',
    '/api/dashboard/stats',
    '/api/system-status',
    '/api/admin-panel/stats',
    '/api/admin-panel/brands',
    '/api/admin-panel/sector-breakdown',
    '/api/sync/complete-sync'
  ];

  // Enhanced sync with intelligent cross-reference management
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Prioritized sync: critical data first, then cross-references
        const criticalEndpoints = ['/api/sectors', '/api/brands', '/api/system-status'];
        const crossRefEndpoints = ['/api/sync/complete-sync', '/api/dashboard/stats'];
        
        // Phase 1: Critical data sync
        await Promise.all(
          criticalEndpoints.map(endpoint => 
            queryClient.invalidateQueries({ queryKey: [endpoint] })
          )
        );
        
        // Phase 2: Cross-reference sync (delayed for data consistency)
        setTimeout(async () => {
          await Promise.all(
            crossRefEndpoints.map(endpoint => 
              queryClient.invalidateQueries({ queryKey: [endpoint] })
            )
          );
        }, 1000);
        
        setSyncStatus(prev => ({
          ...prev,
          lastSync: new Date().toISOString(),
          syncCount: prev.syncCount + 1,
          isConnected: true
        }));
      } catch (error) {
        setSyncStatus(prev => ({
          ...prev,
          isConnected: false,
          errors: [...prev.errors.slice(-4), `Enhanced sync error: ${(error as Error).message}`]
        }));
      }
    }, 30000); // Optimized 30-second sync for better performance with large datasets

    return () => clearInterval(interval);
  }, [queryClient]);

  // Manual force sync function
  const forceSync = useCallback(async () => {
    try {
      // Force refetch all data immediately
      await queryClient.refetchQueries();
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date().toISOString(),
        syncCount: prev.syncCount + 1,
        isConnected: true
      }));
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isConnected: false,
        errors: [...prev.errors.slice(-4), `Force sync error: ${(error as Error).message}`]
      }));
    }
  }, [queryClient]);

  return {
    syncStatus,
    forceSync,
    isOnline: syncStatus.isConnected
  };
}