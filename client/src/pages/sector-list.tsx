
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Eye } from "lucide-react"

// Hardcoded sector data for immediate navigation while API is being fixed
const SECTORS = [
  { id: 1, name: "Agriculture & Biotech", emoji: "🌱", description: "Advanced farming solutions" },
  { id: 2, name: "Banking & Finance", emoji: "🏦", description: "Financial technology services" },
  { id: 3, name: "Logistics & Packaging", emoji: "📦", description: "Supply chain optimization" },
  { id: 4, name: "Professional Services", emoji: "👔", description: "Business consulting" },
  { id: 5, name: "SaaS & Licensing", emoji: "💻", description: "Software solutions" },
  { id: 6, name: "NFT & Ownership", emoji: "🎨", description: "Digital asset management" },
  { id: 7, name: "Quantum Protocols", emoji: "⚛️", description: "Advanced computing" },
  { id: 8, name: "Ritual & Culture", emoji: "🎭", description: "Cultural experiences" },
  { id: 9, name: "Nutrition & Food Chain", emoji: "🍃", description: "Health and wellness" },
  { id: 10, name: "Zero Waste", emoji: "♻️", description: "Sustainability solutions" },
  { id: 11, name: "Voice & Audio", emoji: "🎵", description: "Audio technology" },
  { id: 12, name: "Wellness Tech & Nodes", emoji: "🧘", description: "Health technology" },
  { id: 13, name: "Utilities & Energy", emoji: "⚡", description: "Energy management" },
  { id: 14, name: "Creative Tech", emoji: "🎨", description: "Digital creativity tools" }
]

export default function SectorListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sector Dashboard Navigator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Access comprehensive analytics and management for each sector
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              {SECTORS.length} Sectors Available
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              Schumacher Sales Focus
            </Badge>
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SECTORS.map((sector) => (
            <Card key={sector.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 hover:border-l-purple-500">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                    {sector.emoji}
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {sector.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {sector.description}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <BarChart3 className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                    <p className="text-xs text-gray-500">Analytics</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <p className="text-xs text-gray-500">Performance</p>
                  </div>
                </div>

                {/* Access Button */}
                <Button 
                  onClick={() => {
                    // Direct navigation to sector dashboard with comprehensive content
                    window.location.href = `/sector/${sector.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`
                  }}
                  className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all"
                >
                  Access Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center py-8 border-t">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Each sector dashboard includes comprehensive sales analytics, brand management, and performance metrics
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Real-time Data
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Sales Pipeline
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              Brand Analytics
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}