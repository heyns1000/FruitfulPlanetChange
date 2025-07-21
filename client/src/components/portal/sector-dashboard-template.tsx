import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  BarChart3, 
  PieChart, 
  Activity,
  Globe,
  Zap,
  Calendar,
  MessageSquare,
  Phone,
  MapPin,
  Award,
  Settings,
  Download,
  Share2,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Briefcase,
  Building,
  Network,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { 
  InteractiveCard, 
  RippleEffect, 
  SparkleEffect, 
  PulseIndicator, 
  MorphingButton,
  ProgressRing 
} from "@/components/ui/micro-interactions"
import { LegalRepositoryHub } from "./legal-repository-hub"
import type { Sector, Brand } from "@shared/schema"

interface SectorDashboardProps {
  sector: Sector
  brands?: Brand[]
  className?: string
}

interface SectorMetrics {
  totalRevenue: number
  totalBrands: number
  activeProjects: number
  marketShare: number
  growthRate: number
  customerSatisfaction: number
  salesPipeline: {
    leads: number
    prospects: number
    negotiations: number
    closed: number
  }
  schumacherMetrics: {
    conversionRate: number
    avgDealSize: number
    salesCycle: number
    customerRetention: number
  }
  recentActivity: Array<{
    id: string
    type: 'sale' | 'lead' | 'meeting' | 'proposal'
    description: string
    amount?: number
    timestamp: string
    status: 'success' | 'pending' | 'warning'
  }>
  topPerformers: Array<{
    name: string
    metric: string
    value: number
    trend: 'up' | 'down' | 'stable'
  }>
}

export function SectorDashboardTemplate({ sector, brands = [], className = "" }: SectorDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("30d")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  // Mock data with Schumacher sales focus - in real implementation, this would be fetched from API
  const [metrics, setMetrics] = useState<SectorMetrics>({
    totalRevenue: Math.floor(Math.random() * 10000000) + 1000000,
    totalBrands: brands.length || Math.floor(Math.random() * 50) + 10,
    activeProjects: Math.floor(Math.random() * 25) + 5,
    marketShare: Math.floor(Math.random() * 30) + 10,
    growthRate: Math.floor(Math.random() * 40) + 5,
    customerSatisfaction: Math.floor(Math.random() * 20) + 80,
    salesPipeline: {
      leads: Math.floor(Math.random() * 100) + 50,
      prospects: Math.floor(Math.random() * 50) + 20,
      negotiations: Math.floor(Math.random() * 20) + 5,
      closed: Math.floor(Math.random() * 15) + 3
    },
    schumacherMetrics: {
      conversionRate: Math.floor(Math.random() * 30) + 15,
      avgDealSize: Math.floor(Math.random() * 500000) + 50000,
      salesCycle: Math.floor(Math.random() * 60) + 30,
      customerRetention: Math.floor(Math.random() * 15) + 85
    },
    recentActivity: [
      { id: '1', type: 'sale', description: 'Major enterprise deal closed', amount: 250000, timestamp: '2h ago', status: 'success' },
      { id: '2', type: 'lead', description: 'New qualified lead from web', timestamp: '4h ago', status: 'pending' },
      { id: '3', type: 'meeting', description: 'C-level stakeholder meeting', timestamp: '1d ago', status: 'success' },
      { id: '4', type: 'proposal', description: 'Proposal sent to Fortune 500', amount: 500000, timestamp: '2d ago', status: 'warning' }
    ],
    topPerformers: [
      { name: 'Premium Solutions', metric: 'Revenue', value: 1200000, trend: 'up' },
      { name: 'Enterprise Accounts', metric: 'Deals', value: 45, trend: 'up' },
      { name: 'Strategic Partnerships', metric: 'Growth', value: 28, trend: 'stable' },
      { name: 'Customer Success', metric: 'Retention', value: 94, trend: 'up' }
    ]
  })

  // Color scheme based on sector
  const getSectorColors = () => {
    const metadata = sector.metadata as any || {}
    const colors = {
      primary: metadata.color || '#3b82f6',
      secondary: metadata.secondaryColor || '#1d4ed8',
      accent: metadata.accentColor || '#f59e0b',
      gradient: `linear-gradient(135deg, ${metadata.color || '#3b82f6'}, ${metadata.secondaryColor || '#1d4ed8'})`
    }
    return colors
  }

  const colors = getSectorColors()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <DollarSign className="w-4 h-4" />
      case 'lead': return <Target className="w-4 h-4" />
      case 'meeting': return <Users className="w-4 h-4" />
      case 'proposal': return <Briefcase className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'pending': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className={`sector-dashboard min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${className}`}>
      {/* Header */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl mb-8"
        style={{ background: colors.gradient }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="text-6xl"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {sector.emoji}
              </motion.div>
              <div>
                <motion.h1 
                  className="text-4xl font-bold mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {sector.name}
                </motion.h1>
                <motion.p 
                  className="text-xl opacity-90"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Schumacher Sales Dashboard
                </motion.p>
              </div>
            </div>
            <div className="flex gap-3">
              <MorphingButton className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Download className="w-4 h-4 mr-2" />
                Export
              </MorphingButton>
              <MorphingButton className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </MorphingButton>
              <MorphingButton className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Settings className="w-4 h-4" />
              </MorphingButton>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
              <div className="text-xs opacity-75">+{metrics.growthRate}% vs last month</div>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-5 h-5" />
                <span className="text-sm font-medium">Brands</span>
              </div>
              <div className="text-2xl font-bold">{metrics.totalBrands}</div>
              <div className="text-xs opacity-75">Active portfolio</div>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <span className="text-sm font-medium">Conversion</span>
              </div>
              <div className="text-2xl font-bold">{metrics.schumacherMetrics.conversionRate}%</div>
              <div className="text-xs opacity-75">Lead to sale</div>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Satisfaction</span>
              </div>
              <div className="text-2xl font-bold">{metrics.customerSatisfaction}%</div>
              <div className="text-xs opacity-75">Customer rating</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search brands, deals, metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Auto-refresh:</span>
          <PulseIndicator active={true} color="green" size="sm" />
          <span className="text-sm font-medium">Live</span>
        </div>
      </motion.div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="brands">Brand Portfolio</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="legal">Legal Hub</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Pipeline */}
            <InteractiveCard className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Schumacher Sales Pipeline</h3>
                <Badge variant="secondary">{timeRange}</Badge>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <RippleEffect className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{metrics.salesPipeline.leads}</div>
                  <div className="text-sm text-blue-600">Leads</div>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1 mt-2">
                    <div className="bg-blue-600 h-1 rounded-full" style={{ width: '75%' }} />
                  </div>
                </RippleEffect>

                <RippleEffect className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{metrics.salesPipeline.prospects}</div>
                  <div className="text-sm text-yellow-600">Prospects</div>
                  <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-1 mt-2">
                    <div className="bg-yellow-600 h-1 rounded-full" style={{ width: '60%' }} />
                  </div>
                </RippleEffect>

                <RippleEffect className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{metrics.salesPipeline.negotiations}</div>
                  <div className="text-sm text-orange-600">Negotiations</div>
                  <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-1 mt-2">
                    <div className="bg-orange-600 h-1 rounded-full" style={{ width: '45%' }} />
                  </div>
                </RippleEffect>

                <RippleEffect className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{metrics.salesPipeline.closed}</div>
                  <div className="text-sm text-green-600">Closed</div>
                  <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-1 mt-2">
                    <div className="bg-green-600 h-1 rounded-full" style={{ width: '100%' }} />
                  </div>
                </RippleEffect>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Key Schumacher Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Avg Deal Size</span>
                    <span className="font-bold">{formatCurrency(metrics.schumacherMetrics.avgDealSize)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Sales Cycle</span>
                    <span className="font-bold">{metrics.schumacherMetrics.salesCycle} days</span>
                  </div>
                </div>
              </div>
            </InteractiveCard>

            {/* Recent Activity */}
            <InteractiveCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {metrics.recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.description}</p>
                      {activity.amount && (
                        <p className="text-sm text-green-600 font-semibold">{formatCurrency(activity.amount)}</p>
                      )}
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4" size="sm">
                View All Activity
              </Button>
            </InteractiveCard>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.topPerformers.map((performer, index) => (
              <InteractiveCard key={index} className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getTrendIcon(performer.trend)}
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{performer.metric}</span>
                </div>
                <h4 className="font-semibold mb-1">{performer.name}</h4>
                <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {performer.metric === 'Revenue' ? formatCurrency(performer.value) : formatNumber(performer.value)}
                  {performer.metric === 'Growth' || performer.metric === 'Retention' ? '%' : ''}
                </div>
                <ProgressRing 
                  progress={Math.min(performer.value / (performer.metric === 'Revenue' ? 2000000 : 100) * 100, 100)} 
                  size={40} 
                  className="mx-auto mt-3"
                />
              </InteractiveCard>
            ))}
          </div>
        </TabsContent>

        {/* Sales Pipeline Tab */}
        <TabsContent value="sales" className="space-y-6">
          <InteractiveCard className="p-6">
            <h3 className="text-xl font-bold mb-6">Detailed Sales Pipeline Analysis</h3>
            <div className="text-center text-gray-500 py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Advanced sales pipeline analytics and forecasting tools</p>
              <p className="text-sm">Implementation in progress...</p>
            </div>
          </InteractiveCard>
        </TabsContent>

        {/* Brand Portfolio Tab */}
        <TabsContent value="brands" className="space-y-6">
          <InteractiveCard className="p-6">
            <h3 className="text-xl font-bold mb-6">Brand Portfolio Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.slice(0, 6).map((brand, index) => (
                <RippleEffect
                  key={brand.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ background: colors.gradient }}
                    >
                      {brand.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{brand.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{brand.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">{brand.status}</Badge>
                        <span className="text-xs text-gray-500">{brand.integration}</span>
                      </div>
                    </div>
                  </div>
                </RippleEffect>
              ))}
            </div>
            {brands.length > 6 && (
              <div className="text-center mt-6">
                <Button variant="outline">
                  View All {brands.length} Brands
                </Button>
              </div>
            )}
          </InteractiveCard>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <InteractiveCard className="p-6">
            <h3 className="text-xl font-bold mb-6">Advanced Analytics</h3>
            <div className="text-center text-gray-500 py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Deep analytics and business intelligence dashboard</p>
              <p className="text-sm">Chart visualizations and data insights coming soon...</p>
            </div>
          </InteractiveCard>
        </TabsContent>

        {/* Legal Repository Hub Tab */}
        <TabsContent value="legal" className="space-y-6">
          <LegalRepositoryHub 
            sectorId={sector.id} 
            sectorName={sector.name}
          />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <InteractiveCard className="p-6">
            <h3 className="text-xl font-bold mb-6">Automated Reports</h3>
            <div className="text-center text-gray-500 py-12">
              <Download className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Automated report generation and scheduling</p>
              <p className="text-sm">Custom reports and exports in development...</p>
            </div>
          </InteractiveCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}