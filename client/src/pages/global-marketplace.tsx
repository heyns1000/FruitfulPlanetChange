import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocation } from "wouter"
import { Search, Filter, Sparkles, Loader2, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Brand } from "@shared/schema"

// Helper function to extract metadata field from brand
function getBrandMetadataField(brand: Brand, field: string, defaultValue: string): string {
  if (brand.metadata && typeof brand.metadata === 'object' && field in brand.metadata) {
    return String(brand.metadata[field as keyof typeof brand.metadata])
  }
  return defaultValue
}

export default function GlobalMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [divisionFilter, setDivisionFilter] = useState<string>("all")
  const [isDeploying, setIsDeploying] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState<number | null>(null)
  const [, setLocation] = useLocation()
  const { toast } = useToast()

  // Fetch all brands
  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  })

  // Filter and search brands
  const filteredBrands = useMemo(() => {
    return brands.filter(brand => {
      // Search filter
      if (searchQuery && !brand.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Tier filter - extract from metadata
      if (tierFilter !== "all") {
        const brandTier = getBrandMetadataField(brand, 'tier', 'market').toLowerCase()
        if (brandTier !== tierFilter.toLowerCase()) {
          return false
        }
      }

      // Division filter - extract from metadata
      if (divisionFilter !== "all") {
        const brandDivision = getBrandMetadataField(brand, 'division', 'A').toUpperCase()
        if (brandDivision !== divisionFilter.toUpperCase()) {
          return false
        }
      }

      return true
    })
  }, [brands, searchQuery, tierFilter, divisionFilter])

  // Handle deployment
  const handleDeploy = async (brand: Brand) => {
    setIsDeploying(brand.id)
    
    try {
      const response = await fetch('/api/integration/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // TODO: Replace with actual authenticated user ID when auth is implemented
          userId: 'demo-user-123',
          brandId: brand.id.toString(),
          integrationType: 'brand_license',
          metadata: {
            brandName: brand.name,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "🚀 Deployment Started",
          description: `Integration for ${brand.name} has been queued. Redirecting to dashboard...`,
        })

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          setLocation('/deployment-dashboard')
        }, 1500)
      } else {
        throw new Error(data.error || 'Deployment failed')
      }
    } catch (error) {
      toast({
        title: "❌ Deployment Failed",
        description: error instanceof Error ? error.message : 'Failed to start deployment',
        variant: "destructive",
      })
    } finally {
      setIsDeploying(null)
    }
  }

  // Handle package download
  const handleDownload = async (brand: Brand) => {
    setIsDownloading(brand.id)
    
    try {
      toast({
        title: "📦 Download Started",
        description: `Preparing ${brand.name} package for download...`,
      })

      // Fetch the package ZIP file
      const response = await fetch(`/api/marketplace/packages/${brand.id}/download`)
      
      if (!response.ok) {
        throw new Error('Failed to download package')
      }

      // Get the blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${brand.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}-v1.0.0.zip`
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "✅ Download Complete",
        description: `${brand.name} package downloaded successfully!`,
      })

    } catch (error) {
      toast({
        title: "❌ Download Failed",
        description: error instanceof Error ? error.message : 'Failed to download package',
        variant: "destructive",
      })
    } finally {
      setIsDownloading(null)
    }
  }

  // Get tier badge variant
  const getTierBadge = (brand: Brand) => {
    const tier = getBrandMetadataField(brand, 'tier', 'Market')
    
    const colors = {
      'Sovereign': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Dynastic': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Operational': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Market': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    }

    return (
      <Badge className={colors[tier as keyof typeof colors] || colors.Market}>
        {tier}
      </Badge>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Global Marketplace</h1>
            <p className="text-muted-foreground">
              {filteredBrands.length.toLocaleString()} of {brands.length.toLocaleString()}+ brands available for integration
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
          <CardDescription>
            Find and deploy brand integrations across the FruitfulGlobal ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tier Filter */}
            <div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="sovereign">Sovereign</SelectItem>
                  <SelectItem value="dynastic">Dynastic</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Division Filter */}
            <div>
              <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Divisions</SelectItem>
                  <SelectItem value="A">Division A</SelectItem>
                  <SelectItem value="B">Division B</SelectItem>
                  <SelectItem value="C">Division C</SelectItem>
                  <SelectItem value="D">Division D</SelectItem>
                  <SelectItem value="E">Division E</SelectItem>
                  <SelectItem value="F">Division F</SelectItem>
                  <SelectItem value="G">Division G</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || tierFilter !== "all" || divisionFilter !== "all") && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary">
                  Search: {searchQuery}
                </Badge>
              )}
              {tierFilter !== "all" && (
                <Badge variant="secondary">
                  Tier: {tierFilter}
                </Badge>
              )}
              {divisionFilter !== "all" && (
                <Badge variant="secondary">
                  Division: {divisionFilter}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setTierFilter("all")
                  setDivisionFilter("all")
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Brand Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredBrands.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No brands found matching your filters. Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{brand.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {brand.description || 'No description available'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {getTierBadge(brand)}
                  <Badge variant="outline">{brand.integration}</Badge>
                  {brand.status === 'active' ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{brand.status}</Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleDeploy(brand)}
                    disabled={isDeploying === brand.id || brand.status !== 'active'}
                  >
                    {isDeploying === brand.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Deploy
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(brand)}
                    disabled={isDownloading === brand.id || brand.status !== 'active'}
                  >
                    {isDownloading === brand.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
