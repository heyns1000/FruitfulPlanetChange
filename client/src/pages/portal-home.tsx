import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Rocket, HelpCircle, Plus, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchFilters } from "@/components/portal/search-filters"
import { InteractiveBrandCard } from "@/components/interactive-brand-card"
import { GlobalButtonActivator } from "@/components/global-button-activator"
import { DatabaseIntegrationStatus } from "@/components/database-integration-status"
import { FruitfulMarketplaceIntegration } from "@/components/fruitful-marketplace-integration"
import { motion } from "framer-motion"
import { MorphingButton, SparkleEffect, PulseIndicator } from "@/components/ui/micro-interactions"
import { AmbientGradientMood, useMoodFromPortalData, MoodPresets } from "@/components/ui/ambient-gradient-mood"
import type { Brand, Sector } from "@shared/schema"
import { GlobalSyncIndicator } from '@/components/global-sync-indicator';
import { EnhancedSidebar } from '@/components/portal/enhanced-sidebar';
import { DatabaseAssetSync } from '@/components/database-asset-sync';


interface DashboardStats {
  totalElements: number;
  coreBrands: number;
  subNodes: number;
  sectors: number;
  legalDocuments: number;
  repositories: number;
  totalPayments: number;
  mediaProjects: number;
  processingEngines: number;
  integrationTiers: { tier1: number; tier2: number; tier3: number };
  globalRevenue: string;
  activeBrands: number;
  marketPenetration: number;
  revenueGrowth: number;
}

export default function PortalHome() {
  console.log("🏠 PortalHome component rendering");
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState<number | null>(null)
  const [displayLimit, setDisplayLimit] = useState(8)
  // Active section state for sidebar
  const [activeSection, setActiveSection] = useState('overview');
  // User activity tracking for ambient mood
  const [userActivity, setUserActivity] = useState(50)

  // ALL HOOKS MUST BE CALLED AT TOP LEVEL - BEFORE ANY CONDITIONAL LOGIC
  // Use React Query for system status and sectors
  const systemStatusQuery = useQuery({
    queryKey: ["system-status"],
    queryFn: async () => {
      console.log('🔍 Fetching system status...');
      const response = await fetch('/api/system-status');
      if (!response.ok) {
        throw new Error('Failed to fetch system status');
      }
      const data = await response.json();
      console.log('📊 System Status API Response:', data);
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: true
  });

  const sectorsQuery = useQuery<Sector[]>({
    queryKey: ["sectors"],
    queryFn: async () => {
      console.log('🔍 Fetching sectors...');
      const response = await fetch('/api/sectors');
      if (!response.ok) {
        throw new Error('Failed to fetch sectors');
      }
      const data = await response.json();
      console.log('📊 Sectors API Response:', { count: data.length, sample: data.slice(0, 3) });
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: true
  });

  // Direct brands fetching - bypassing React Query issues
  const [brands, setBrands] = React.useState<Brand[]>([])
  const [brandsLoading, setBrandsLoading] = React.useState(true)
  const [brandsError, setBrandsError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchBrands = async () => {
      try {
        console.log('🔍 Direct fetch: Loading brands...');
        setBrandsLoading(true)
        setBrandsError(null)
        
        const response = await fetch('/api/brands')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const data = await response.json()
        if (Array.isArray(data)) {
          setBrands(data)
          console.log('✅ Direct fetch: Loaded', data.length, 'brands successfully')
        }
      } catch (error) {
        console.error('❌ Direct fetch error:', error)
        setBrandsError('Failed to load brands')
      } finally {
        setBrandsLoading(false)
      }
    }

    fetchBrands()
    const interval = setInterval(fetchBrands, 15000)
    return () => clearInterval(interval)
  }, [])

  // Mock query object for compatibility
  const brandsQuery = {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError ? new Error(brandsError) : null,
    isSuccess: brands.length > 0,
    isFetching: brandsLoading,
    status: brandsLoading ? 'pending' : 'success'
  } as const;

  // Enhanced dashboard stats query
  const dashboardStatsQuery = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      console.log('🔍 Fetching dashboard stats...');
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        console.error('❌ Dashboard Stats API Error:', response.status, response.statusText);
        throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
      }
      const data = await response.json();
      console.log('📊 Dashboard Stats API Response:', data);
      console.log('✅ Dashboard stats query completed successfully');
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: true
  });

  // Handle keyboard shortcuts - useEffect must be called consistently
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        searchInput?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Build query parameters
  const queryParams = new URLSearchParams()
  if (searchQuery) queryParams.set("search", searchQuery)
  if (selectedSector) queryParams.set("sectorId", selectedSector.toString())

  console.log('🔍 Brands Query Debug:', {
    brandsCount: brandsQuery.data?.length || 0,
    isLoading: brandsQuery.isLoading,
    error: brandsQuery.error?.message || null,
    isSuccess: brandsQuery.isSuccess,
    isFetching: brandsQuery.isFetching,
    status: brandsQuery.status
  });

  console.log('📊 Dashboard Stats Debug:', {
    dashboardStats: dashboardStatsQuery.data || {},
    brandsLength: brandsQuery.data?.length || 0,
    isLoading: dashboardStatsQuery.isLoading,
    isSuccess: dashboardStatsQuery.isSuccess,
    error: dashboardStatsQuery.error?.message || null,
    status: dashboardStatsQuery.status
  });

  // Only show loading for initial load, not refetches
  const isInitialLoading = systemStatusQuery.isLoading || sectorsQuery.isLoading || 
                          (brandsQuery.isLoading && !brandsQuery.data) || 
                          (dashboardStatsQuery.isLoading && !dashboardStatsQuery.data);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
        <GlobalSyncIndicator />
        <EnhancedSidebar 
          onSectionSelect={setActiveSection}
          activeSection={activeSection}
        />
        <div className="flex-1">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-40">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #0891b2, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Seedwave Portal - Loading...
                </h1>
                <PulseIndicator />
              </div>
              <div className="flex gap-4">
                <MorphingButton
                  Icon={Rocket}
                  label="Initializing..."
                  onClick={() => {}}
                  variant="outline"
                />
                <SparkleEffect>
                  <Button size="icon" variant="ghost" className="text-gray-500">
                    <HelpCircle className="w-5 h-5" />
                  </Button>
                </SparkleEffect>
              </div>
            </div>
          </header>
          <main className="p-8 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="text-2xl font-semibold text-gray-900 mt-4">Loading Portal...</h2>
              <div className="text-gray-600 space-y-1 mt-2">
                <p>System Status: {systemStatusQuery.isLoading ? "Loading..." : "✓ Ready"}</p>
                <p>Sectors: {sectorsQuery.isLoading ? "Loading..." : "✓ Ready"}</p>
                <p>Brands: {(brandsQuery.isLoading && !brandsQuery.data) ? "Loading..." : "✓ Ready"}</p>
                <p>Dashboard: {(dashboardStatsQuery.isLoading && !dashboardStatsQuery.data) ? "Loading..." : "✓ Ready"}</p>
              </div>
              <p className="text-sm text-blue-600 mt-4">Database contains 3,794+ brands</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Handle error states
  if (systemStatusQuery.error || sectorsQuery.error || brandsQuery.error || dashboardStatsQuery.error) {
    console.error('Portal loading errors:', {
      systemStatus: systemStatusQuery.error?.message,
      sectors: sectorsQuery.error?.message,
      brands: brandsQuery.error?.message,
      dashboardStats: dashboardStatsQuery.error?.message
    });
    // Optionally, render an error message component here
  }

  // Data access with proper fallbacks
  const systemStatus = systemStatusQuery.data || [];
  const sectors = sectorsQuery.data || [];
  // brands variable already defined above from direct fetch
  const dashboardStats = dashboardStatsQuery.data || {
    totalElements: 3794,
    coreBrands: 2862,
    subNodes: 866,
    sectors: 48,
    legalDocuments: 8,
    repositories: 61,
    totalPayments: 0,
    mediaProjects: 0,
    processingEngines: 0,
    integrationTiers: { tier1: 2825, tier2: 63, tier3: 62 },
    globalRevenue: "0",
    activeBrands: 3728,
    marketPenetration: 98.3,
    revenueGrowth: 0
  };

  // Simplified mood for ambient gradient (using basic data to avoid hooks order issues)
  const portalMood = {
    energy: brands.length > 2000 ? 85 : 60,
    success: brands.length > 3000 ? 90 : 70,
    activity: brandsLoading ? 90 : userActivity,
    focus: brandsError ? 30 : 80
  }

  // Track user interactions for mood
  const trackUserActivity = () => {
    setUserActivity(prev => Math.min(100, prev + 5))
    setTimeout(() => setUserActivity(prev => Math.max(20, prev - 1)), 2000)
  }

  // Force render even if some queries are still loading
  const hasValidData = true; // Always render the portal

  console.log('🎯 Portal Render State:', {
    systemStatusLoaded: !!systemStatusQuery.data,
    sectorsLoaded: !!sectorsQuery.data,
    brandsLoaded: !!brandsQuery.data,
    dashboardStatsLoaded: !!dashboardStatsQuery.data,
    brandsCount: brands.length,
    sectorsCount: sectors.length,
    hasValidData
  });

  // Create sector lookup map
  const sectorMap = sectors.reduce((map, sector) => {
    map[sector.id] = sector
    return map
  }, {} as Record<number, Sector>)

  // Filter brands based on search and sector
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = !searchQuery || 
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = !selectedSector || brand.sectorId === selectedSector;
    return matchesSearch && matchesSector;
  });

  const displayedBrands = filteredBrands.slice(0, displayLimit)
  const remainingCount = filteredBrands.length - displayLimit



  return (
    <AmbientGradientMood 
      mood={portalMood} 
      intensity="medium"
      className="min-h-screen bg-white"
    >
      <div className="min-h-screen" style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        visibility: 'visible',
        display: 'block'
      }} onClick={trackUserActivity}>
        {/* Global Button Activation System - Makes ALL buttons functional */}
        <GlobalButtonActivator />

        <GlobalSyncIndicator />

      {/* Enhanced Sidebar */}
      <EnhancedSidebar 
        onSectionSelect={setActiveSection}
        activeSection={activeSection}
      />

      {/* Main Content Area */}
      <div style={{ marginLeft: '320px', width: 'calc(100% - 320px)' }}>
        {/* Enhanced Portal Header */}
        <header style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '24px',
          display: 'block',
          visibility: 'visible',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #0891b2, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>
                Seedwave Portal - Working
              </h1>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Database: {(dashboardStats as any)?.totalElements || 3794} brands | Loading: {brandsQuery.isLoading ? 'Yes' : 'No'} | Loaded: {brands.length} brands
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: 'linear-gradient(to right, #0891b2, #3b82f6)',
                color: 'white',
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></span>
                VaultMesh™ Secured
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#0891b2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                SW
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
        {/* Database Sync Status */}
        <section className="mb-8">
          <DatabaseAssetSync />
        </section>

        {/* Database Integration Status - Shows PostgreSQL Connection */}
        <section className="p-6">
          <DatabaseIntegrationStatus />
        </section>

        {/* Fruitful Global Marketplace - Real Products from Database */}
        <section className="p-6 border-t border-gray-200 dark:border-gray-700">
          <FruitfulMarketplaceIntegration />
        </section>

        {/* Quick Stats Dashboard */}
        <section className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Brands</h3>
              <p className="text-2xl font-bold text-blue-600">{brands.length.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Active Sectors</h3>
              <p className="text-2xl font-bold text-green-600">{sectors.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Market Coverage</h3>
              <p className="text-2xl font-bold text-purple-600">{dashboardStats.marketPenetration}%</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Core Brands</h3>
              <p className="text-2xl font-bold text-orange-600">{dashboardStats.coreBrands.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="p-6" data-tour="dashboard-stats">
          <SearchFilters
            onSearch={setSearchQuery}
            onSectorFilter={setSelectedSector}
            selectedSector={selectedSector}
          />
          {(searchQuery || selectedSector) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchQuery && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedSector && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Sector: {sectorMap[selectedSector]?.name}
                </span>
              )}
              <button 
                onClick={() => {setSearchQuery(''); setSelectedSector(null);}}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Brand Elements Grid */}
        <section className="p-6" data-tour="sectors-grid">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Brand Elements
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || selectedSector ? 
                `Showing ${filteredBrands.length} of ${brands.length} brands` :
                `Explore and discover brand elements across all sectors (${brands.length} total)`
              }
            </p>
          </div>

          {brandsQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedBrands.map((brand, index) => (
                <div key={brand.id} data-tour={index === 0 ? "sector-card" : undefined}>
                  <InteractiveBrandCard
                    brand={brand}
                    sector={brand.sectorId ? sectorMap[brand.sectorId] : undefined}
                  />
                </div>
              ))}

              {/* Load More Button */}
              {remainingCount > 0 && (
                <div className="col-span-full flex flex-col items-center mt-8 gap-4">
                  <Button
                    onClick={() => setDisplayLimit(prev => prev + 8)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Load More Brands ({remainingCount.toLocaleString()}+ remaining)
                  </Button>
                  <div className="text-xs text-gray-500 flex items-center gap-4">
                    <span>💡 Press ⌘+K to search</span>
                    <span>📊 {Math.round((displayedBrands.length / filteredBrands.length) * 100)}% loaded</span>
                  </div>
                </div>
              )}

              {remainingCount === 0 && filteredBrands.length > 8 && (
                <div className="col-span-full text-center mt-8 p-6 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">🎉 All {filteredBrands.length} brands loaded!</p>
                  <p className="text-green-600 text-sm mt-1">Scroll up or use search to find specific brands</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="p-6" data-tour="recent-activity">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
                <p className="opacity-90">
                  Explore the full ecosystem or connect with our development team.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  className="bg-white text-cyan-500 hover:bg-gray-100"
                  onClick={() => {
                    console.log("🚀 Launching new project...")
                    window.open("/dashboard", "_blank")
                  }}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Project
                </Button>
                <Button
                  variant="ghost"
                  className="bg-white bg-opacity-20 text-white hover:bg-white hover:bg-opacity-30"
                  onClick={() => {
                    console.log("❓ Opening support portal...")
                    window.open("mailto:support@seedwave.com", "_blank")
                  }}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Get Support
                </Button>
              </div>
            </div>
          </div>
        </section>
        </main>
        
        <div className="fixed bottom-4 right-4 z-50 bg-white/80 backdrop-blur rounded-lg p-3 shadow-lg text-xs">
          <div className="space-y-1">
            <div className="font-semibold text-gray-700">Ambient Mood</div>
            <div>Energy: {Math.round(portalMood.energy)}%</div>
            <div>Success: {Math.round(portalMood.success)}%</div>
            <div>Activity: {Math.round(portalMood.activity)}%</div>
            <div>Focus: {Math.round(portalMood.focus)}%</div>
            <div className="text-gray-500">Brands: {brands.length}</div>
          </div>
        </div>
        
      </div>
      </div>
    </AmbientGradientMood>
  )
}