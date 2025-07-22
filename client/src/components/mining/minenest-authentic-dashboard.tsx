import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Pickaxe, 
  Activity, 
  TrendingUp, 
  Shield, 
  Zap, 
  Settings, 
  BarChart3,
  DollarSign,
  Users,
  Globe,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  Database,
  MapPin,
  Wrench,
  Building,
  Search,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";

interface MiningDashboardData {
  sector: {
    id: number;
    name: string;
    emoji: string;
  };
  totalBrands: number;
  totalSubnodes: number;
  totalElements: number;
  parentBrands: Array<{
    id: number;
    name: string;
    description: string;
    status: string;
    integration: string;
    metadata: {
      tier: string;
      activeRigs?: number;
      monthlyYield?: number;
      performance?: number;
      totalProjects?: number;
    };
  }>;
  subnodes: Array<{
    id: number;
    name: string;
    parentId: number;
    metadata: {
      component?: string;
      performance?: number;
    };
  }>;
  metrics: {
    totalActiveRigs: number;
    totalMonthlyYield: number;
    avgPerformance: number;
    coreSystems: number;
    integrationTier: string;
    activeBrands: number;
  };
  recentActivities: Array<{
    action: string;
    brand: string;
    timestamp: string;
    status: string;
  }>;
}

export function MineNestAuthenticDashboard() {
  // Fetch authentic mining dashboard data
  const { data: miningData, isLoading } = useQuery<MiningDashboardData>({
    queryKey: ["/api/mining/dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/mining/dashboard");
      if (!response.ok) throw new Error('Failed to fetch mining dashboard');
      return response.json();
    }
  });

  // Fetch mining performance metrics
  const { data: metricsData } = useQuery({
    queryKey: ["/api/mining/metrics"],
    queryFn: async () => {
      const response = await fetch("/api/mining/metrics");
      if (!response.ok) throw new Error('Failed to fetch mining metrics');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!miningData) {
    return (
      <div className="p-6">
        <div className="text-center text-red-400">
          Failed to load MineNest™ dashboard data
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* MineNest Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Pickaxe className="w-8 h-8 text-yellow-500" />
            MineNest™ Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Comprehensive mining ecosystem with {miningData.totalBrands} parent brands + {miningData.totalSubnodes} subnodes = {miningData.totalElements} total mining elements
          </p>
        </div>
        <Badge variant="outline" className="text-green-400 border-green-400">
          {miningData.metrics.integrationTier} Integration
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Total Brands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{miningData.totalBrands}</div>
              <p className="text-xs text-gray-400">{miningData.metrics.activeBrands} active</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Active Rigs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{miningData.metrics.totalActiveRigs}</div>
              <p className="text-xs text-gray-400">Across all sites</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Core Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{miningData.metrics.coreSystems}</div>
              <p className="text-xs text-gray-400">A+ & A tier</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{miningData.metrics.avgPerformance}%</div>
              <p className="text-xs text-gray-400">Average system</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-600">Overview</TabsTrigger>
          <TabsTrigger value="brands" className="data-[state=active]:bg-green-600">Brand Management</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">Analytics</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-green-600">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Overview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metricsData?.performanceTrends ? (
                  <div className="space-y-3">
                    {metricsData.performanceTrends.slice(-3).map((trend: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-400">{trend.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full" 
                              style={{ width: `${(trend.value / 6000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-medium">{trend.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">Loading performance data...</div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {miningData.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <div>
                        <div className="text-white font-medium">{activity.action}</div>
                        <div className="text-gray-400 text-sm">{activity.brand}</div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={activity.status === "active" ? "default" : "secondary"}
                          className={activity.status === "active" ? "bg-green-600" : "bg-gray-600"}
                        >
                          {activity.status}
                        </Badge>
                        <div className="text-gray-400 text-xs">{activity.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="brands" className="space-y-6">
          {/* Mining Brands Grid */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Pickaxe className="w-5 h-5 text-yellow-400" />
                Mining Brands ({miningData.totalBrands} Parent + {miningData.totalSubnodes} Subnodes)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {miningData.parentBrands.slice(0, 9).map((brand) => (
                  <motion.div
                    key={brand.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:border-green-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{brand.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`${
                          brand.metadata.tier === "A+" ? "border-green-400 text-green-400" :
                          brand.metadata.tier === "A" ? "border-blue-400 text-blue-400" :
                          "border-gray-400 text-gray-400"
                        }`}
                      >
                        {brand.metadata.tier}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{brand.description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Rigs:</span>
                        <span className="text-white">{brand.metadata.activeRigs || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Performance:</span>
                        <span className="text-green-400">{brand.metadata.performance || 90}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Integration:</span>
                        <span className="text-blue-400">{brand.integration}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                        Manage
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {miningData.parentBrands.length > 9 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                    View All {miningData.totalBrands} Mining Brands
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Brand Distribution */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Brand Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {metricsData?.statusDistribution ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Active Brands</span>
                      <span className="text-green-400 font-bold">{metricsData.statusDistribution.active}%</span>
                    </div>
                    <Progress value={metricsData.statusDistribution.active} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Core Systems</span>
                      <span className="text-blue-400 font-bold">{metricsData.statusDistribution.core}%</span>
                    </div>
                    <Progress value={metricsData.statusDistribution.core} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Development</span>
                      <span className="text-yellow-400 font-bold">{metricsData.statusDistribution.development}%</span>
                    </div>
                    <Progress value={metricsData.statusDistribution.development} className="h-2" />
                  </div>
                ) : (
                  <div className="text-gray-400">Loading analytics...</div>
                )}
              </CardContent>
            </Card>

            {/* Integration Overview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Integration Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">VaultMesh™</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">GridCore™</span>
                    <Badge className="bg-blue-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">MineCore™</span>
                    <Badge className="bg-purple-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Baobab Legal</span>
                    <Badge className="bg-yellow-600">Compliance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                MineNest™ Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <div>
                    <div className="text-white font-medium">Real-time Monitoring</div>
                    <div className="text-gray-400 text-sm">Live ore tracking and performance monitoring</div>
                  </div>
                  <Badge className="bg-green-600">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <div>
                    <div className="text-white font-medium">VaultMesh™ Security</div>
                    <div className="text-gray-400 text-sm">Advanced encryption and secure data transmission</div>
                  </div>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <div>
                    <div className="text-white font-medium">Baobab Legal Compliance</div>
                    <div className="text-gray-400 text-sm">Environmental and regulatory compliance monitoring</div>
                  </div>
                  <Badge className="bg-green-600">Compliant</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}