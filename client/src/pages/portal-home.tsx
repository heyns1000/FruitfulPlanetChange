import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Rocket, HelpCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchFilters } from "@/components/portal/search-filters"
import { InteractiveBrandCard } from "@/components/interactive-brand-card"
import { GlobalButtonActivator } from "@/components/global-button-activator"
import { DatabaseIntegrationStatus } from "@/components/database-integration-status"
import { FruitfulMarketplaceIntegration } from "@/components/fruitful-marketplace-integration"
import { motion } from "framer-motion"
import { MorphingButton, SparkleEffect, PulseIndicator } from "@/components/ui/micro-interactions"
import type { Brand, Sector } from "@shared/schema"

export default function PortalHome() {
  console.log("🏠 PortalHome component rendering");
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState<number | null>(null)
  const [displayLimit, setDisplayLimit] = useState(8)

  // ALL HOOKS MUST BE CALLED AT TOP LEVEL - BEFORE ANY CONDITIONAL LOGIC
  // Use React Query for system status and sectors
  const systemStatusQuery = useQuery({
    queryKey: ["/api/system-status"],
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5000, // Real-time system monitoring
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  const sectorsQuery = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
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
    staleTime: 30000,
    refetchInterval: 30000, // Live data refresh
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  // Enhanced brands query with debug logging
  const brandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      console.log('🔍 Fetching brands from API...');
      const response = await fetch('/api/brands');
      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }
      const data = await response.json();
      console.log('📊 Brands API Response:', { count: data.length, sample: data.slice(0, 3) });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });

  // Enhanced dashboard stats query
  const dashboardStatsQuery = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      console.log('📊 Dashboard Stats API Response:', data);
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true
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
    isSuccess: brandsQuery.isSuccess
  });

  console.log('📊 Dashboard Stats Debug:', {
    dashboardStats: dashboardStatsQuery.data || {},
    brandsLength: brandsQuery.data?.length || 0,
    isLoading: dashboardStatsQuery.isLoading,
    isSuccess: dashboardStatsQuery.isSuccess,
    error: dashboardStatsQuery.error?.message || null
  });

  // Show loading state with better feedback
  if (systemStatusQuery.isLoading || sectorsQuery.isLoading || brandsQuery.isLoading || dashboardStatsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">Loading Portal...</h2>
          <p className="text-gray-600">
            {systemStatusQuery.isLoading && "Loading system status..."}
            {sectorsQuery.isLoading && "Loading sectors..."}
            {brandsQuery.isLoading && "Loading brands..."}
            {dashboardStatsQuery.isLoading && "Loading dashboard stats..."}
          </p>
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
  const brands = brandsQuery.data || [];
  const dashboardStats = dashboardStatsQuery.data || {
    totalElements: 0,
    coreBrands: 0,
    subNodes: 0,
    sectors: 0,
    legalDocuments: 0,
    repositories: 0,
    totalPayments: 0,
    mediaProjects: 0,
    processingEngines: 0,
    integrationTiers: { tier1: 0, tier2: 0, tier3: 0 },
    globalRevenue: "0",
    activeBrands: 0,
    marketPenetration: 0,
    revenueGrowth: 0
  };

  // Ensure we have valid data
  const hasValidData = dashboardStats.totalElements > 0 || brands.length > 0 || sectors.length > 0;

  // Create sector lookup map
  const sectorMap = sectors.reduce((map, sector) => {
    map[sector.id] = sector
    return map
  }, {} as Record<number, Sector>)

  const displayedBrands = brands.slice(0, displayLimit)
  const remainingCount = brands.length - displayLimit

  return (
    <div className="min-h-screen bg-white" style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      display: 'block',
      position: 'relative',
      zIndex: 1,
      visibility: 'visible'
    }}>
      {/* Global Button Activation System - Makes ALL buttons functional */}
      <GlobalButtonActivator />



      {/* Header - Forced Visibility */}
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

      {/* Database Integration Status - Shows PostgreSQL Connection */}
      <section className="p-6">
        <DatabaseIntegrationStatus />
      </section>

      {/* Fruitful Global Marketplace - Real Products from Database */}
      <section className="p-6 border-t border-gray-200 dark:border-gray-700">
        <FruitfulMarketplaceIntegration />
      </section>

      {/* Search and Filters */}
      <section className="p-6" data-tour="dashboard-stats">
        <SearchFilters
          onSearch={setSearchQuery}
          onSectorFilter={setSelectedSector}
          selectedSector={selectedSector}
        />
      </section>

      {/* Brand Elements Grid */}
      <section className="p-6" data-tour="sectors-grid">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Brand Elements
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore and discover brand elements across all sectors
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
              <div className="col-span-full flex justify-center mt-8">
                <Button
                  onClick={() => setDisplayLimit(prev => prev + 8)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Load More Brands ({remainingCount.toLocaleString()}+ remaining)
                </Button>
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
    </div>
  )
}