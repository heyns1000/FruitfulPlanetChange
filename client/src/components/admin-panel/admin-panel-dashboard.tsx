/**
 * Admin Panel Dashboard Component
 * Displays comprehensive brand arrays from interns.seedwave.faa.zone
 * Integration with OmniGrid FAA.zone Admin Portal
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  TrendingUp, 
  Zap, 
  Settings,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface AdminPanelBrand {
  id: number;
  sectorKey: string;
  sectorName: string;
  sectorEmoji: string;
  brandName: string;
  subNodes: string[];
  isCore: boolean;
  status: string;
  metadata: any;
  createdAt: string;
}

interface AdminPanelStats {
  totalBrands: number;
  totalSectors: number;
  activeBrands: number;
  totalSubNodes: number;
  sectorBreakdown: Record<string, any>;
  lastUpdate: string;
  dataSource: string;
  integrationStatus: string;
}

export default function AdminPanelDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  // Fetch admin panel statistics
  const { data: stats, isLoading: statsLoading } = useQuery<AdminPanelStats>({
    queryKey: ['/api/admin-panel/stats'],
    refetchInterval: 30000 // Real-time updates every 30 seconds
  });

  // Fetch all admin panel brands
  const { data: allBrands, isLoading: brandsLoading, refetch: refetchBrands } = useQuery<AdminPanelBrand[]>({
    queryKey: ['/api/admin-panel/brands'],
    refetchInterval: 30000
  });

  // Seed admin panel data
  const seedAdminPanelData = async () => {
    try {
      const response = await fetch('/api/admin-panel/seed', { method: 'POST' });
      const result = await response.json();
      console.log('Admin panel seeded:', result);
      refetchBrands();
    } catch (error) {
      console.error('Seeding error:', error);
    }
  };

  // Filter brands based on search and sector selection
  const filteredBrands = allBrands?.filter(brand => {
    const matchesSearch = brand.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.sectorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'all' || brand.sectorKey === selectedSector;
    return matchesSearch && matchesSector;
  }) || [];

  // Get unique sectors for filter dropdown
  const uniqueSectors = Array.from(new Set(allBrands?.map(brand => ({
    key: brand.sectorKey,
    name: brand.sectorName,
    emoji: brand.sectorEmoji
  })) || []));

  if (statsLoading || brandsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-green-500" />
        </motion.div>
        <span className="ml-3 text-lg text-gray-600">Loading Admin Panel Data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                OmniGrid FAA.zone™ Admin Portal
              </h1>
              <p className="text-gray-400 mt-2">
                Comprehensive brand management from interns.seedwave.faa.zone
              </p>
            </div>
            <Button 
              onClick={seedAdminPanelData}
              className="bg-green-600 hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Data
            </Button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Brands</CardTitle>
                <Database className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalBrands.toLocaleString()}</div>
                <p className="text-xs text-gray-400">From {stats.totalSectors} sectors</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Active Brands</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.activeBrands.toLocaleString()}</div>
                <p className="text-xs text-gray-400">
                  {((stats.activeBrands / stats.totalBrands) * 100).toFixed(1)}% active rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Sub Nodes</CardTitle>
                <Zap className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalSubNodes.toLocaleString()}</div>
                <p className="text-xs text-gray-400">Connected nodes</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Integration</CardTitle>
                <Settings className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.integrationStatus.replace('_', ' ').toUpperCase()}
                </div>
                <p className="text-xs text-gray-400">{stats.dataSource}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search and Filter Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search brands, sectors, or nodes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="w-full md:w-64">
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 border-gray-600 text-white"
                  >
                    <option value="all">All Sectors</option>
                    {uniqueSectors.map((sector, index) => (
                      <option key={index} value={sector.key}>
                        {sector.emoji} {sector.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" className="border-gray-600">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" className="border-gray-600">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Brands Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredBrands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white truncate">
                      {brand.brandName}
                    </CardTitle>
                    <Badge 
                      variant={brand.status === 'active' ? 'default' : 'secondary'}
                      className={brand.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}
                    >
                      {brand.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="mr-1">{brand.sectorEmoji}</span>
                    <span className="truncate">{brand.sectorName}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-400">Sub Nodes: </span>
                      <span className="text-white font-medium">{brand.subNodes.length}</span>
                    </div>
                    {brand.subNodes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {brand.subNodes.slice(0, 3).map((node, nodeIndex) => (
                          <Badge key={nodeIndex} variant="outline" className="text-xs">
                            {node}
                          </Badge>
                        ))}
                        {brand.subNodes.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{brand.subNodes.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Results Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400">
            Showing {filteredBrands.length} of {allBrands?.length || 0} brands
            {searchQuery && (
              <span> matching "{searchQuery}"</span>
            )}
            {selectedSector !== 'all' && (
              <span> in {uniqueSectors.find(s => s.key === selectedSector)?.name}</span>
            )}
          </p>
        </motion.div>

      </div>
    </div>
  );
}