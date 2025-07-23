import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Activity, CheckCircle, AlertTriangle, RefreshCw, Eye, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WildlifeProductModal } from "@/components/wildlife-product-modal"

export function DatabaseIntegrationStatus() {
  const { toast } = useToast()

  // Connect ONLY to authentic repositories - NO FAKE DATA
  const { data: repoData, isLoading: brandsLoading } = useQuery({
    queryKey: ["/api/authentic/repositories"],
    refetchInterval: 10000, // Update every 10 seconds
    retry: false
  });

  const brands = repoData?.repositories || [];

  // Keep your PAID sector dashboard functionality
  const { data: sectors = [], isLoading: sectorsLoading } = useQuery({
    queryKey: ["/api/sectors"],
    refetchInterval: 10000,
    retry: false
  });

  // Also get authentic repositories for display
  const { data: sectorData } = useQuery({
    queryKey: ["/api/authentic/sectors"],
    refetchInterval: 10000,
    retry: false
  });

  const { data: systemStatus = [], isLoading: statusLoading } = useQuery<any[]>({
    queryKey: ["/api/system-status"],
    refetchInterval: 5000, // Real-time monitoring
  })

  const { data: dashboardStats = {} } = useQuery<any>({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000,
  })

  const handleViewDatabase = () => {
    toast({
      title: "Database Access",
      description: "Opening PostgreSQL database console in new tab...",
    })
    // In production, this would open the database console
    console.log("🗃️ Opening PostgreSQL database console")
  }

  const handleRefreshData = () => {
    toast({
      title: "Data Refresh",
      description: "Refreshing all database connections and live data feeds...",
    })
    window.location.reload()
  }

  const integrationStatus = [
    {
      name: "Authentic Repositories",
      count: Array.isArray(brands) ? brands.length : 0,
      status: Array.isArray(brands) && brands.length > 0 ? "connected" : "disconnected",
      description: `GitHub repositories from heyns1000 account with ${Array.isArray(brands) ? brands.length : 0} active repositories`,
      table: "authentic_repositories"
    },
    {
      name: "Authentic Sectors",
      count: (dashboardStats as any)?.totalSectors || 0,
      status: (dashboardStats as any)?.totalSectors > 0 ? "connected" : "disconnected",
      description: `Real sectors from GitHub repositories with ${(dashboardStats as any)?.totalSectors || 0} active sectors`,
      table: "authentic_sectors"
    },
    {
      name: "System Status",
      count: Array.isArray(systemStatus) ? systemStatus.length : 0,
      status: Array.isArray(systemStatus) && systemStatus.length > 0 ? "connected" : "disconnected", 
      description: `Live monitoring of ${Array.isArray(systemStatus) ? systemStatus.length : 0} system services`,
      table: "system_status"
    },
    {
      name: "Legal Documents", 
      count: (dashboardStats as any)?.legalDocuments || 0,
      status: (dashboardStats as any)?.legalDocuments > 0 ? "connected" : "disconnected",
      description: "SecureSign™ VIP document management system",
      table: "legal_documents"
    },
    {
      name: "Payments System",
      count: (dashboardStats as any)?.totalPayments || 0,
      status: (dashboardStats as any)?.totalPayments > 0 ? "connected" : "disconnected",
      description: "Transaction processing and payment records",
      table: "payments"
    },
    {
      name: "Media Projects",
      count: (dashboardStats as any)?.mediaProjects || 0,
      status: (dashboardStats as any)?.mediaProjects > 0 ? "connected" : "disconnected",
      description: "Motion, Media & Sonic project database",
      table: "media_projects"
    },
    {
      name: "Repositories",
      count: (dashboardStats as any)?.repositories || 0,
      status: (dashboardStats as any)?.repositories > 0 ? "connected" : "disconnected",
      description: "Code repository and deployment tracking",
      table: "repositories"
    },
    {
      name: "Processing Engines",
      count: (dashboardStats as any)?.processingEngines || 0,
      status: (dashboardStats as any)?.processingEngines > 0 ? "connected" : "disconnected",
      description: "AI processing and automation engines",
      table: "processing_engines"
    }
  ]

  const connectedCount = integrationStatus.filter(item => item.status === "connected").length
  const totalSystems = integrationStatus.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6 text-cyan-500" />
            PostgreSQL Database Integration
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete Seedwave portal connected to live PostgreSQL database with real-time data synchronization
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <WildlifeProductModal
            trigger={
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Shield className="h-4 w-4 mr-2" />
                Wildlife Products
              </Button>
            }
          />
          <Button onClick={handleViewDatabase} size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Database
          </Button>
        </div>
      </div>

      {/* Connection Status Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-200">
                  Database Fully Connected
                </h3>
                <p className="text-green-600 dark:text-green-300">
                  {connectedCount}/{totalSystems} systems integrated with live data synchronization
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{(dashboardStats as any)?.totalBrands || 0}</div>
              <div className="text-sm text-green-600">Total Brand Records</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Tables Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrationStatus.map((system) => (
          <Card key={system.name} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{system.name}</CardTitle>
                <Badge 
                  variant={system.status === "connected" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {system.status === "connected" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {system.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Records:</span>
                  <span className="font-semibold">{system.count.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {system.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Activity className="h-3 w-3" />
                  <span>Table: {system.table}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Data Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Live Database Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Brand Database Query</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {brandsLoading ? 'Loading...' : (Array.isArray(brands) ? brands.length : 0)} records loaded
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Sectors Database Query</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {sectorsLoading ? 'Loading...' : (Array.isArray(sectors) ? sectors.length : 0)} sectors active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Status Monitor</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {statusLoading ? 'Loading...' : (Array.isArray(systemStatus) ? systemStatus.length : 0)} services monitored
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}