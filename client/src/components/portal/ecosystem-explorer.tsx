import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Search,
  Filter,
  Globe,
  Building,
  Zap,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  Package,
  Shield,
  Database,
  Network,
  Cpu,
  Eye
} from 'lucide-react';
import { 
  COMPREHENSIVE_SECTOR_LIST, 
  COMPREHENSIVE_BRAND_DATA, 
  GLOBAL_ECOSYSTEM_METRICS,
  TECH_STACK_DATA,
  LICENSE_LEDGER_DATA
} from '@shared/schema';

interface BrandNode {
  name: string;
  type: 'brand' | 'node';
  sector: string;
  sectorName: string;
  description?: string;
  integrations?: string[];
}

// Comprehensive Ecosystem Explorer with ALL 7,038+ brands and complete sector integration
export function EcosystemExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'tree'>('grid');
  const [activeTab, setActiveTab] = useState('overview');

  // Flatten all brands and nodes from the comprehensive data
  const allBrandNodes = useMemo(() => {
    const nodes: BrandNode[] = [];
    
    Object.entries(COMPREHENSIVE_BRAND_DATA).forEach(([sectorKey, sectorData]) => {
      // Add brands
      sectorData.brands.forEach(brandName => {
        nodes.push({
          name: brandName,
          type: 'brand',
          sector: sectorKey,
          sectorName: sectorData.name,
          description: `Core brand in ${sectorData.name}`,
          integrations: ['VaultMesh™', 'HotStack', 'FAA.ZONE™']
        });
      });
      
      // Add nodes
      sectorData.nodes.forEach(nodeName => {
        nodes.push({
          name: nodeName,
          type: 'node',
          sector: sectorKey,
          sectorName: sectorData.name,
          description: `Subnode component in ${sectorData.name}`,
          integrations: ['Seedwave™', 'Admin Portal']
        });
      });
    });

    return nodes;
  }, []);

  // Filter brands and nodes based on search and sector selection
  const filteredNodes = useMemo(() => {
    return allBrandNodes.filter(node => {
      const matchesSearch = searchTerm === '' || 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.sectorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = selectedSector === 'all' || node.sector === selectedSector;
      
      return matchesSearch && matchesSector;
    });
  }, [allBrandNodes, searchTerm, selectedSector]);

  const sectorStats = useMemo(() => {
    const stats: Record<string, { brands: number; nodes: number }> = {};
    
    Object.entries(COMPREHENSIVE_BRAND_DATA).forEach(([sectorKey, sectorData]) => {
      stats[sectorKey] = {
        brands: sectorData.brands.length,
        nodes: sectorData.nodes.length
      };
    });
    
    return stats;
  }, []);

  const renderBrandNode = (node: BrandNode) => (
    <Card key={`${node.sector}-${node.name}`} className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              node.type === 'brand' ? 'bg-blue-500' : 'bg-green-500'
            }`} />
            <h4 className="font-semibold text-sm">{node.name}</h4>
          </div>
          <Badge variant={node.type === 'brand' ? 'default' : 'secondary'} className="text-xs">
            {node.type === 'brand' ? 'Core' : 'Node'}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mb-2">{node.sectorName}</p>
        <p className="text-xs text-gray-600 mb-3">{node.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {node.integrations?.map(integration => (
            <Badge key={integration} variant="outline" className="text-xs px-1 py-0">
              {integration}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
            <Package className="w-3 h-3 mr-1" />
            Deploy
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                🌐 Fruitful Global Ecosystem Explorer
              </CardTitle>
              <CardDescription className="text-lg">
                Complete omnilevel integration: {GLOBAL_ECOSYSTEM_METRICS.totalBrands.toLocaleString()} brands across {GLOBAL_ECOSYSTEM_METRICS.totalSectors} sectors
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4">
                <Badge variant="default" className="bg-blue-500">
                  <Activity className="w-3 h-3 mr-1" />
                  {GLOBAL_ECOSYSTEM_METRICS.coreBrands} Core Brands
                </Badge>
                <Badge variant="secondary">
                  <Network className="w-3 h-3 mr-1" />
                  {GLOBAL_ECOSYSTEM_METRICS.totalNodes} Nodes
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Global Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Brands</p>
                <p className="text-2xl font-bold">{GLOBAL_ECOSYSTEM_METRICS.totalBrands.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Core Brands</p>
                <p className="text-2xl font-bold">{GLOBAL_ECOSYSTEM_METRICS.coreBrands}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Network className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Nodes</p>
                <p className="text-2xl font-bold">{GLOBAL_ECOSYSTEM_METRICS.totalNodes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sectors</p>
                <p className="text-2xl font-bold">{GLOBAL_ECOSYSTEM_METRICS.totalSectors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Explorer Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="brands" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Brand Explorer
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Sectors
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Tech Stack
            </TabsTrigger>
            <TabsTrigger value="licensing" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Licensing
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sector Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Distribution</CardTitle>
                <CardDescription>Brand and node distribution across all sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(COMPREHENSIVE_SECTOR_LIST).slice(0, 10).map(([key, name]) => {
                    const stats = sectorStats[key] || { brands: 0, nodes: 0 };
                    const total = stats.brands + stats.nodes;
                    
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {stats.brands}B
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {stats.nodes}N
                          </Badge>
                          <span className="text-xs text-muted-foreground w-8 text-right">
                            {total}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* System Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>Omnilevel integration across all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium">VaultMesh™</span>
                    </div>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm font-medium">HotStack</span>
                    </div>
                    <Badge variant="default" className="bg-blue-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      <span className="text-sm font-medium">FAA.ZONE™</span>
                    </div>
                    <Badge variant="default" className="bg-purple-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full" />
                      <span className="text-sm font-medium">Seedwave™ Admin</span>
                    </div>
                    <Badge variant="default" className="bg-orange-500">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Brand Explorer Tab */}
        <TabsContent value="brands" className="space-y-6">
          {/* Search and Filter Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search brands, nodes, or sectors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {Object.entries(COMPREHENSIVE_SECTOR_LIST).map(([key, name]) => (
                        <SelectItem key={key} value={key}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                    <Filter className="w-4 h-4 mr-2" />
                    {viewMode === 'grid' ? 'List' : 'Grid'}
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>Showing {filteredNodes.length} of {allBrandNodes.length} items</span>
                {selectedSector !== 'all' && (
                  <span>• Filtered by: {COMPREHENSIVE_SECTOR_LIST[selectedSector as keyof typeof COMPREHENSIVE_SECTOR_LIST]}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Brand Grid */}
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredNodes.map(renderBrandNode)}
          </div>
        </TabsContent>

        {/* Sectors Tab */}
        <TabsContent value="sectors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(COMPREHENSIVE_SECTOR_LIST).map(([key, name]) => {
              const sectorData = COMPREHENSIVE_BRAND_DATA[key as keyof typeof COMPREHENSIVE_BRAND_DATA];
              const stats = sectorStats[key] || { brands: 0, nodes: 0 };
              
              return (
                <Card key={key} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{name}</CardTitle>
                      <Badge variant="outline">{stats.brands + stats.nodes}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Core Brands</span>
                        <span className="font-medium">{stats.brands}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subnodes</span>
                        <span className="font-medium">{stats.nodes}</span>
                      </div>
                      <Separator />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Explore
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tech Stack Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(TECH_STACK_DATA).map(([key, tech]) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tech.icon}</span>
                    <div>
                      <CardTitle className="text-xl">{tech.title}</CardTitle>
                      <CardDescription>{tech.details}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Key Features:</h4>
                    <ul className="space-y-1">
                      {tech.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Licensing Tab */}
        <TabsContent value="licensing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>License Ledger Overview</CardTitle>
              <CardDescription>Comprehensive licensing and sovereignty management across all tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Tier Distribution</h4>
                  <div className="space-y-2">
                    {LICENSE_LEDGER_DATA.growth.datasets.map((tier, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-sm">{tier.label}</span>
                        <Badge variant="outline">{tier.data[tier.data.length - 1]}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Active Clauses</h4>
                  <div className="space-y-2">
                    {LICENSE_LEDGER_DATA.clauses.labels.map((clause, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-sm">{clause}</span>
                        <Badge variant="outline">{LICENSE_LEDGER_DATA.clauses.data[index]}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}