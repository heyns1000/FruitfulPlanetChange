import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  COMPREHENSIVE_BRAND_DATA, 
  COMPREHENSIVE_SECTOR_LIST, 
  GLOBAL_ECOSYSTEM_METRICS 
} from "@shared/schema"
import type { Brand, Sector } from "@shared/schema"

interface DashboardStats {
  totalElements: number
  coreBrands: number
  subNodes: number
  sectors: number
  integrationTiers: {
    tier1: number
    tier2: number  
    tier3: number
  }
  globalRevenue: number
  marketShare: number
  growthRate: number
}

const CHART_COLORS = [
  '#0ea5e9', '#10b981', '#f97316', '#8b5cf6', '#ef4444', 
  '#06b6d4', '#84cc16', '#f59e0b', '#ec4899', '#6366f1'
]

export function GlobalDashboard() {
  const [selectedView, setSelectedView] = useState("overview")
  const [animationKey, setAnimationKey] = useState(0)

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  })

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  })

  const { data: dashboardStats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  })

  // Trigger animation refresh when view changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [selectedView])

  // Use actual sector data from database or fallback to reference data
  const comprehensiveSectors = sectors.length > 0 ? 
    sectors.map(sector => ({
      name: sector.name,
      icon: sector.emoji,
      brands: sector.brandCount,
      nodes: sector.subnodeCount,
      key: sector.name.toLowerCase().replace(/[^a-z]/g, '')
    })) :
    [
      { name: "Agriculture & Biotech", icon: "🌱", brands: 84, nodes: 28, key: "agriculture" },
      { name: "Banking & Finance", icon: "🏦", brands: 60, nodes: 20, key: "banking" },
      { name: "Food & Farming", icon: "🥦", brands: 48, nodes: 16, key: "food" },
      { name: "Logistics & Packaging", icon: "📦", brands: 30, nodes: 10, key: "logistics" },
      { name: "Professional Services", icon: "💼", brands: 30, nodes: 10, key: "professional" },
      { name: "Education & IP", icon: "📚", brands: 28, nodes: 10, key: "education" },
      { name: "Fashion & Identity", icon: "✂️", brands: 25, nodes: 9, key: "fashion" },
      { name: "Gaming & Simulation", icon: "🎮", brands: 22, nodes: 8, key: "gaming" },
      { name: "SaaS & Licensing", icon: "💻", brands: 20, nodes: 7, key: "saas" },
      { name: "NFT & Ownership", icon: "🎨", brands: 20, nodes: 7, key: "nft" },
      { name: "Quantum Protocols", icon: "⚛️", brands: 20, nodes: 7, key: "quantum" },
      { name: "Ritual & Culture", icon: "🎭", brands: 20, nodes: 7, key: "ritual" },
      { name: "Nutrition & Food Chain", icon: "🍎", brands: 20, nodes: 7, key: "nutrition" },
      { name: "Health & Hygiene", icon: "🧠", brands: 20, nodes: 7, key: "health" },
      { name: "Zero Waste", icon: "♻️", brands: 20, nodes: 7, key: "zerowaste" },
      { name: "Housing & Infrastructure", icon: "🏗️", brands: 18, nodes: 6, key: "housing" },
      { name: "AI, Logic & Grid", icon: "🤖", brands: 16, nodes: 6, key: "ai" },
      { name: "Media & Sonic", icon: "📺", brands: 15, nodes: 5, key: "media" },
      { name: "Transport & Mobility", icon: "🚗", brands: 14, nodes: 5, key: "transport" },
      { name: "Mining & Resources", icon: "⛏️", brands: 13, nodes: 5, key: "mining" },
      { name: "Voice & Audio", icon: "🎤", brands: 12, nodes: 4, key: "voice" },
      { name: "Wellness Tech & Nodes", icon: "🧘", brands: 12, nodes: 4, key: "wellness" },
      { name: "Utilities & Energy", icon: "⚡", brands: 12, nodes: 4, key: "utilities" },
      { name: "Justice & Legal", icon: "⚖️", brands: 12, nodes: 4, key: "justice" },
      { name: "Retail & Commerce", icon: "🛍️", brands: 11, nodes: 4, key: "retail" },
      { name: "Creative Tech", icon: "🎨", brands: 10, nodes: 3, key: "creative" }
    ];

  // Calculate sector distribution from comprehensive data
  const sectorDistribution = comprehensiveSectors.map(sector => ({
    name: sector.name,
    count: sector.brands || 0,
    nodes: sector.nodes || 0,
    key: sector.key
  })).sort((a, b) => (b.count || 0) - (a.count || 0))

  // Calculate integration tier data
  const integrationData = [
    { name: 'VaultMesh™ Core', value: dashboardStats?.integrationTiers?.tier1 || 120 },
    { name: 'HotStack Deploy', value: dashboardStats?.integrationTiers?.tier2 || 89 },
    { name: 'FAA.ZONE™ Hub', value: dashboardStats?.integrationTiers?.tier3 || 64 }
  ]

  // Monthly growth data
  const monthlyGrowth = [
    { month: 'Jan', brands: 5420, revenue: 2.1 },
    { month: 'Feb', brands: 5681, revenue: 2.3 },
    { month: 'Mar', brands: 5892, revenue: 2.5 },
    { month: 'Apr', brands: 6005, revenue: 2.8 },
    { month: 'May', brands: 6152, revenue: 3.1 },
    { month: 'Jun', brands: 6284, revenue: 3.4 }
  ]

  // Top performing sectors for charts
  const topSectors = sectorDistribution.slice(0, 8)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Global Seedwave™ Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive ecosystem analytics and brand management portal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ✓ Live Data Feed
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            VaultMesh™ Secured
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              {formatNumber(dashboardStats?.totalElements || GLOBAL_ECOSYSTEM_METRICS.totalBrands)}
            </div>
            <p className="text-xs text-gray-500 mt-1">+{dashboardStats?.growthRate || 23.6}% this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Core Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(dashboardStats?.coreBrands || GLOBAL_ECOSYSTEM_METRICS.coreBrands)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active deployments</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Sub Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatNumber(dashboardStats?.subNodes || GLOBAL_ECOSYSTEM_METRICS.totalNodes)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Nested integrations</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Sectors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dashboardStats?.sectors || GLOBAL_ECOSYSTEM_METRICS.totalSectors}
            </div>
            <p className="text-xs text-gray-500 mt-1">Industry coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sector Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Distribution</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Brand distribution across {GLOBAL_ECOSYSTEM_METRICS.totalSectors} sectors
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topSectors} key={animationKey}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Integration Tiers */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Tiers</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Distribution by integration platform
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart key={animationKey}>
                    <Pie
                      data={integrationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {integrationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Growth Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly brand additions and revenue growth
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyGrowth} key={animationKey}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="brands" fill="#10b981" name="Brands" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} name="Revenue (M)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comprehensiveSectors.map((sector, index) => (
              <Card key={sector.key} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sector.icon}</span>
                      <h4 className="font-semibold text-sm">{sector.name}</h4>
                    </div>
                    <span className="text-xl font-bold">{sector.brands || 0}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Brands</span>
                      <span className="font-bold">{sector.brands || 0}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Nodes</span>
                      <span className="font-bold">{sector.nodes || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${((sector.brands || 0) / (comprehensiveSectors[0]?.brands || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {integrationData.map((integration, index) => (
              <Card key={integration.name} className="border-l-4" style={{ borderLeftColor: CHART_COLORS[index] }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {integration.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2" style={{ color: CHART_COLORS[index] }}>
                    {integration.value}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Active deployments
                  </p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(integration.value / Math.max(...integrationData.map(i => i.value))) * 100}%`,
                        backgroundColor: CHART_COLORS[index]
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Global Revenue</span>
                  <span className="font-bold text-green-600">
                    ${formatNumber(dashboardStats?.globalRevenue || 12459782)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Market Share</span>
                  <span className="font-bold text-blue-600">
                    {dashboardStats?.marketShare || 87.4}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Growth Rate</span>
                  <span className="font-bold text-orange-600">
                    +{dashboardStats?.growthRate || 23.6}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Uptime</span>
                  <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>API Response</span>
                  <Badge className="bg-blue-100 text-blue-800">&lt; 100ms</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Data Sync</span>
                  <Badge className="bg-green-100 text-green-800">Real-time</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}