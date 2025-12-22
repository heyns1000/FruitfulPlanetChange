import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Network, Database, GitBranch } from 'lucide-react';
import type { Brand, Sector } from '@shared/schema';

interface EcosystemPulse {
  pulse_id: string;
  timestamp: string;
  vault_ids: string[];
  active_sectors: any[];
  brand_health: any[];
  codenest_digest: any[];
  signal_strength: number;
  seedwave_metadata?: any;
  network_graph_data?: any;
  status: string;
}

interface VaultNode {
  nodeId: string;
  nodeType: string;
  nodeName: string;
  connections: string[];
  traceLayer: string;
  position?: { x: number; y: number };
}

/**
 * Ecosystem Explorer 2 - Network Graph Visualization
 * Focused on VaultTrace™ network visualization and real-time pulse monitoring
 */
export default function EcosystemExplorer2() {
  const [latestPulse, setLatestPulse] = useState<EcosystemPulse | null>(null);
  const [vaultNetwork, setVaultNetwork] = useState<VaultNode[]>([]);
  const [pulseHistory, setPulseHistory] = useState<EcosystemPulse[]>([]);

  // Fetch brands and sectors data
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ['/api/sectors'],
  });

  // Fetch latest pulse every 9 seconds
  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const response = await fetch('/api/banimal/pulse/latest');
        if (response.ok) {
          const data = await response.json();
          setLatestPulse(data);

          // Add to history (keep last 10)
          setPulseHistory((prev) => [data, ...prev.slice(0, 9)]);
        }
      } catch (error) {
        console.error('Failed to fetch pulse:', error);
      }
    };

    // Fetch vault network
    const fetchVaultNetwork = async () => {
      try {
        const response = await fetch('/api/banimal/vault-network');
        if (response.ok) {
          const data = await response.json();
          setVaultNetwork(data.nodes || []);
        }
      } catch (error) {
        console.error('Failed to fetch vault network:', error);
      }
    };

    // Initial fetch
    fetchPulse();
    fetchVaultNetwork();

    // Poll every 9 seconds
    const interval = setInterval(fetchPulse, 9000);

    return () => clearInterval(interval);
  }, []);

  const calculateSignalTrend = () => {
    if (pulseHistory.length < 2) return 'stable';
    const latest = pulseHistory[0]?.signal_strength || 0;
    const previous = pulseHistory[1]?.signal_strength || 0;
    if (latest > previous) return 'increasing';
    if (latest < previous) return 'decreasing';
    return 'stable';
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'KAU_TRACE':
        return 'bg-blue-500';
      case 'CLAIM_TRACE':
        return 'bg-purple-500';
      case 'VAULT_TRACE':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🕸️ Ecosystem Network Graph</h1>
        <p className="text-purple-100">
          VaultTrace™ Network Visualization with Live Pulse Monitoring
        </p>
        <div className="flex gap-4 mt-4 text-sm">
          <Badge className="bg-white/20 text-white border-white/30">
            <Network className="h-3 w-3 mr-1" />
            {vaultNetwork.length} Nodes
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            <GitBranch className="h-3 w-3 mr-1" />
            {vaultNetwork.reduce((sum, n) => sum + n.connections.length, 0)} Connections
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            <Zap className="h-3 w-3 mr-1" />
            Signal: {latestPulse?.signal_strength || 0}%
          </Badge>
        </div>
      </div>

      {/* Real-Time Pulse Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Signal Strength</p>
                <p className="text-2xl font-bold text-green-600">
                  {latestPulse?.signal_strength || 0}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500 animate-pulse" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${latestPulse?.signal_strength || 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Sectors</p>
                <p className="text-2xl font-bold text-blue-600">
                  {latestPulse?.active_sectors.length || 0}
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Trend: {calculateSignalTrend()}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vault IDs</p>
                <p className="text-2xl font-bold text-purple-600">
                  {latestPulse?.vault_ids.length || 0}
                </p>
              </div>
              <Network className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              CodeNest: {latestPulse?.codenest_digest.length || 0} repos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Pulse</p>
                <p className="text-lg font-bold text-orange-600">
                  {latestPulse ? new Date(latestPulse.timestamp).toLocaleTimeString() : '--:--:--'}
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Pulse ID: {latestPulse?.pulse_id.slice(-8) || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* VaultTrace Network Nodes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            VaultTrace™ Network Graph
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            CLAQTNEQT™ tracing across KAU_TRACE, CLAIM_TRACE, and VAULT_TRACE layers
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Layer Legend */}
            <div className="flex gap-4 pb-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">KAU_TRACE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm">CLAIM_TRACE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">VAULT_TRACE</span>
              </div>
            </div>

            {/* Network Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {vaultNetwork.map((node) => (
                <div
                  key={node.nodeId}
                  className="border rounded-lg p-3 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getLayerColor(node.traceLayer)}`} />
                      <div>
                        <p className="font-semibold text-sm">{node.nodeName}</p>
                        <p className="text-xs text-gray-500">{node.nodeType}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Layer: <span className="font-medium">{node.traceLayer}</span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Connections: <span className="font-medium">{node.connections.length}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {vaultNetwork.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Network className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No network nodes available. Pulse data will populate the network graph.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pulse History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Pulse History (Last 10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pulseHistory.map((pulse, index) => (
              <div
                key={pulse.pulse_id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0
                    ? 'bg-green-50 dark:bg-green-950 border border-green-200'
                    : 'bg-gray-50 dark:bg-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(pulse.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{pulse.pulse_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={pulse.signal_strength >= 90 ? 'default' : 'secondary'}>
                    {pulse.signal_strength}%
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {pulse.active_sectors.length} sectors
                  </span>
                </div>
              </div>
            ))}
            {pulseHistory.length === 0 && (
              <p className="text-center py-4 text-gray-500">Waiting for pulse data...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
