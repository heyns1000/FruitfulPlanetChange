import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Network, Zap, ArrowRight, Filter, RefreshCw } from "lucide-react"
import type { Sector, Brand } from "@shared/schema"

interface SectorNode {
  id: number
  name: string
  emoji: string
  tier: string
  brandCount: number
  x: number
  y: number
  connections: number[]
  radius: number
  color: string
}

interface Connection {
  source: number
  target: number
  strength: number
  type: 'brand_sharing' | 'supply_chain' | 'strategic' | 'operational'
}

export function SectorRelationshipMapping() {
  const [selectedNode, setSelectedNode] = useState<SectorNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<'all' | 'brand_sharing' | 'supply_chain' | 'strategic' | 'operational'>('all')
  const [isAnimating, setIsAnimating] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
    staleTime: 30000,
  })

  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
    staleTime: 30000,
  })

  // Generate sector nodes with relationship data
  const sectorNodes: SectorNode[] = sectors.map((sector, index) => {
    const brandCount = brands.filter(b => b.sectorId === sector.id).length
    const metadata = sector.metadata as any || {}
    const tier = metadata.tier || 'standard'
    
    // Calculate position in a circular layout with clustering by category
    const angle = (index / sectors.length) * 2 * Math.PI
    const radius = 200 + (brandCount * 2) // Larger sectors are positioned further out
    const centerX = 400
    const centerY = 300
    
    return {
      id: sector.id,
      name: sector.name,
      emoji: sector.emoji || '⚡',
      tier,
      brandCount,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      connections: generateConnections(sector, sectors, brands),
      radius: Math.max(20, Math.min(50, brandCount * 0.5 + 15)),
      color: getTierColor(tier)
    }
  })

  // Generate connections between sectors based on shared brands, similar categories, etc.
  const connections: Connection[] = []
  sectorNodes.forEach(sourceNode => {
    sourceNode.connections.forEach(targetId => {
      const targetNode = sectorNodes.find(n => n.id === targetId)
      if (targetNode && sourceNode.id < targetId) { // Avoid duplicate connections
        const strength = calculateConnectionStrength(sourceNode, targetNode, brands)
        const type = determineConnectionType(sourceNode, targetNode)
        
        connections.push({
          source: sourceNode.id,
          target: targetId,
          strength,
          type
        })
      }
    })
  })

  // Filter connections by type
  const filteredConnections = connections.filter(conn => 
    filterType === 'all' || conn.type === filterType
  )

  // Filter nodes by search
  const filteredNodes = sectorNodes.filter(node =>
    node.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Clear canvas
    ctx.fillStyle = '#0f172a' // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    filteredConnections.forEach(connection => {
      const sourceNode = sectorNodes.find(n => n.id === connection.source)
      const targetNode = sectorNodes.find(n => n.id === connection.target)
      
      if (sourceNode && targetNode) {
        drawConnection(ctx, sourceNode, targetNode, connection)
      }
    })

    // Draw nodes
    filteredNodes.forEach(node => {
      drawNode(ctx, node, node.id === hoveredNode || node.id === selectedNode?.id)
    })

    // Draw node labels
    filteredNodes.forEach(node => {
      drawNodeLabel(ctx, node)
    })

  }, [sectorNodes, connections, hoveredNode, selectedNode, searchQuery, filterType])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find clicked node
    const clickedNode = sectorNodes.find(node => {
      const dx = x - node.x
      const dy = y - node.y
      return Math.sqrt(dx * dx + dy * dy) <= node.radius
    })

    setSelectedNode(clickedNode || null)
  }

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find hovered node
    const hoveredNode = sectorNodes.find(node => {
      const dx = x - node.x
      const dy = y - node.y
      return Math.sqrt(dx * dx + dy * dy) <= node.radius
    })

    setHoveredNode(hoveredNode?.id || null)
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Network className="h-6 w-6 text-blue-600" />
            Interactive Sector Relationship Mapping
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Explore connections between {sectors.length} sectors across the ecosystem
          </p>
        </div>
        <Button
          onClick={() => setIsAnimating(!isAnimating)}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnimating ? 'animate-spin' : ''}`} />
          {isAnimating ? 'Stop Animation' : 'Start Animation'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Connection Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full p-2 border rounded-md text-sm bg-background"
                >
                  <option value="all">All Connections</option>
                  <option value="brand_sharing">Brand Sharing</option>
                  <option value="supply_chain">Supply Chain</option>
                  <option value="strategic">Strategic</option>
                  <option value="operational">Operational</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Brand Sharing</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Supply Chain</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Strategic</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Operational</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Network Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Sectors:</span>
                <span className="font-bold">{sectors.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Brands:</span>
                <span className="font-bold">{brands.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Connections:</span>
                <span className="font-bold">{filteredConnections.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Connections:</span>
                <span className="font-bold">
                  {sectors.length > 0 ? (filteredConnections.length * 2 / sectors.length).toFixed(1) : 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Network Visualization */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div 
                ref={containerRef}
                className="relative bg-slate-900 rounded-lg overflow-hidden"
              >
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-auto cursor-crosshair"
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                />
                
                {/* Node tooltip */}
                {hoveredNode && (
                  <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border z-10">
                    {(() => {
                      const node = sectorNodes.find(n => n.id === hoveredNode)
                      if (!node) return null
                      return (
                        <div>
                          <div className="font-semibold">{node.emoji} {node.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {node.brandCount} brands • {node.tier} tier
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {node.connections.length} connections
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{selectedNode.emoji}</span>
                {selectedNode.name}
                <Badge variant="secondary">{selectedNode.tier}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Sector Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>Brands: <span className="font-bold">{selectedNode.brandCount}</span></div>
                    <div>Tier: <span className="font-bold capitalize">{selectedNode.tier}</span></div>
                    <div>Connections: <span className="font-bold">{selectedNode.connections.length}</span></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Connected Sectors</h4>
                  <div className="space-y-1">
                    {selectedNode.connections.slice(0, 5).map(connId => {
                      const connectedSector = sectors.find(s => s.id === connId)
                      return connectedSector ? (
                        <div key={connId} className="text-sm flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                          {connectedSector.emoji} {connectedSector.name}
                        </div>
                      ) : null
                    })}
                    {selectedNode.connections.length > 5 && (
                      <div className="text-xs text-gray-500">
                        +{selectedNode.connections.length - 5} more...
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Relationship Types</h4>
                  <div className="space-y-1">
                    {['brand_sharing', 'supply_chain', 'strategic', 'operational'].map(type => {
                      const count = connections.filter(c => 
                        (c.source === selectedNode.id || c.target === selectedNode.id) && c.type === type
                      ).length
                      return (
                        <div key={type} className="text-sm flex justify-between">
                          <span className="capitalize">{type.replace('_', ' ')}:</span>
                          <span className="font-bold">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

// Helper functions
function generateConnections(sector: Sector, allSectors: Sector[], brands: Brand[]): number[] {
  const connections: number[] = []
  const sectorBrands = brands.filter(b => b.sectorId === sector.id)
  
  // Find sectors with similar names or categories
  allSectors.forEach(otherSector => {
    if (otherSector.id === sector.id) return
    
    let connectionScore = 0
    
    // Brand sharing connections
    const otherBrands = brands.filter(b => b.sectorId === otherSector.id)
    const sharedBrands = sectorBrands.filter(b1 => 
      otherBrands.some(b2 => b1.name.toLowerCase().includes(b2.name.toLowerCase().split('™')[0]))
    )
    connectionScore += sharedBrands.length * 10
    
    // Category similarity
    const sectorWords = sector.name.toLowerCase().split(/[\s&,]+/)
    const otherWords = otherSector.name.toLowerCase().split(/[\s&,]+/)
    const commonWords = sectorWords.filter(word => otherWords.includes(word))
    connectionScore += commonWords.length * 5
    
    // Tier proximity
    const tierValues = { 'enterprise': 5, 'professional': 4, 'growth': 3, 'standard': 2, 'eco': 1 }
    const sectorMetadata = sector.metadata as any || {}
    const otherMetadata = otherSector.metadata as any || {}
    const sectorTier = tierValues[sectorMetadata.tier as keyof typeof tierValues] || 2
    const otherTier = tierValues[otherMetadata.tier as keyof typeof tierValues] || 2
    connectionScore += Math.max(0, 3 - Math.abs(sectorTier - otherTier))
    
    if (connectionScore >= 8) {
      connections.push(otherSector.id)
    }
  })
  
  return connections
}

function calculateConnectionStrength(node1: SectorNode, node2: SectorNode, brands: Brand[]): number {
  // Calculate strength based on brand count and tier similarity
  const brandFactor = (node1.brandCount + node2.brandCount) / 100
  const tierFactor = node1.tier === node2.tier ? 1.5 : 1
  return Math.min(1, brandFactor * tierFactor)
}

function determineConnectionType(node1: SectorNode, node2: SectorNode): Connection['type'] {
  // Determine connection type based on sector names and characteristics
  const name1 = node1.name.toLowerCase()
  const name2 = node2.name.toLowerCase()
  
  if (name1.includes('logistics') || name2.includes('logistics') || 
      name1.includes('packaging') || name2.includes('packaging')) {
    return 'supply_chain'
  }
  
  if (name1.includes('admin') || name2.includes('admin') ||
      name1.includes('finance') || name2.includes('finance')) {
    return 'operational'
  }
  
  if (node1.tier === 'enterprise' && node2.tier === 'enterprise') {
    return 'strategic'
  }
  
  return 'brand_sharing'
}

function getTierColor(tier: string): string {
  switch (tier) {
    case 'enterprise': return '#dc2626'
    case 'professional': return '#9333ea'
    case 'growth': return '#059669'
    case 'standard': return '#2563eb'
    case 'eco': return '#16a34a'
    default: return '#6b7280'
  }
}

function drawConnection(ctx: CanvasRenderingContext2D, source: SectorNode, target: SectorNode, connection: Connection) {
  const alpha = Math.max(0.1, connection.strength)
  
  ctx.beginPath()
  ctx.moveTo(source.x, source.y)
  ctx.lineTo(target.x, target.y)
  
  // Set color based on connection type
  const colors = {
    brand_sharing: `rgba(59, 130, 246, ${alpha})`,
    supply_chain: `rgba(34, 197, 94, ${alpha})`,
    strategic: `rgba(147, 51, 234, ${alpha})`,
    operational: `rgba(249, 115, 22, ${alpha})`
  }
  
  ctx.strokeStyle = colors[connection.type]
  ctx.lineWidth = Math.max(1, connection.strength * 3)
  ctx.stroke()
}

function drawNode(ctx: CanvasRenderingContext2D, node: SectorNode, isHighlighted: boolean) {
  // Draw node circle
  ctx.beginPath()
  ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
  
  if (isHighlighted) {
    ctx.fillStyle = node.color
    ctx.shadowColor = node.color
    ctx.shadowBlur = 20
  } else {
    ctx.fillStyle = node.color + '99'
    ctx.shadowBlur = 0
  }
  
  ctx.fill()
  
  // Draw border
  ctx.strokeStyle = isHighlighted ? '#ffffff' : node.color
  ctx.lineWidth = isHighlighted ? 3 : 1
  ctx.stroke()
  
  // Draw emoji in center
  ctx.fillStyle = '#ffffff'
  ctx.font = `${node.radius * 0.8}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(node.emoji, node.x, node.y)
}

function drawNodeLabel(ctx: CanvasRenderingContext2D, node: SectorNode) {
  // Draw sector name below node
  ctx.fillStyle = '#ffffff'
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  
  const maxWidth = 80
  const words = node.name.split(' ')
  let line = ''
  let y = node.y + node.radius + 5
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), node.x, y)
      line = words[i] + ' '
      y += 12
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), node.x, y)
}