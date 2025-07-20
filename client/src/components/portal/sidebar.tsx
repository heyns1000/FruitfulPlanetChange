import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Menu, X } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { SystemStatus } from "./system-status"
import type { Sector } from "@shared/schema"

interface SidebarProps {
  activePage: string
  onPageChange: (page: string) => void
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { theme, toggleTheme, toggleHyperMode, isHyperMode } = useTheme()

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"],
  })

  const navItems = [
    { id: "home", label: "Portal Home", icon: "🏠" },
    { id: "fruitful-crate-dance", label: "Fruitful Crate Dance", icon: "🕺", badge: "6,005+ Brands" },
    { id: "brand-identity-manager", label: "Brand Identity Manager", icon: "🏢", badge: "6,005 Individual Sites" },
    { id: "brands", label: "Brand Elements", icon: "🧩", badge: "6,005" },
    { id: "sectors", label: "Sectors", icon: "🗂️", badge: "33" },
    { id: "marketplace", label: "Marketplace", icon: "🛒" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "integrations", label: "Integrations", icon: "🔌" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ]

  const ecosystemItems = [
    { id: "ecosystem-explorer", label: "🌐 Ecosystem Explorer", icon: "🗺️", badge: "PLAN V1-9" },
    { id: "fruitful-marketplace", label: "🛒 Fruitful™ Marketplace", icon: "🛍️", badge: "6,005+ Brands" },
    { id: "hotstack-codenest", label: "🔥 HotStack + CodeNest", icon: "💻", badge: "Independent Repos" },
    { id: "global-pulse", label: "Global Pulse", icon: "🌍", badge: "Analytics" },
    { id: "seedwave-admin", label: "🦁 Seedwave™ Admin", icon: "⚙️", badge: "7,038 Brands" },
    { id: "legal-hub", label: "Legal Hub", icon: "⚖️", badge: "Legal Docs" },
    { id: "payment-hub", label: "Payment Portal", icon: "💳", badge: "SSO" },
    { id: "vaultmesh-checkout", label: "VaultMesh™ Checkout", icon: "🔐", badge: "Banimal Loop" },
  ]

  const adminItems = [
    { id: "interns", label: "Interns", icon: "👨‍🎓" },
    { id: "compliance", label: "Compliance", icon: "🛡️" },
  ]

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-dark-card p-2 rounded-lg shadow-lg border border-gray-200 dark:border-dark-border"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        sidebar fixed left-0 top-0 h-full w-80 p-6 overflow-y-auto z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold">
              <span className="text-cyan-500">Seedwave™</span> Portal
            </h2>
            <p className="text-sm text-cyan-500 opacity-75">Powered by VaultMesh™</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-12 h-6 bg-gray-300 dark:bg-cyan-500 rounded-full relative transition-colors"
            >
              <div className={`
                absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform
                ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </button>
            {/* Hyper Mode Toggle */}
            <button
              onClick={toggleHyperMode}
              className={`
                px-2 py-1 text-xs font-bold border rounded transition-all
                ${isHyperMode 
                  ? 'bg-cyan-500 text-white border-cyan-500' 
                  : 'text-cyan-500 border-cyan-500 hover:bg-cyan-500 hover:text-white'
                }
              `}
            >
              {isHyperMode ? 'EXIT HYPER' : 'HYPER'}
            </button>
          </div>
        </div>

        {/* System Status */}
        <SystemStatus />

        {/* Navigation */}
        <nav className="space-y-2 mb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id)
                setIsMobileOpen(false)
              }}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
                ${activePage === item.id
                  ? 'bg-cyan-500 bg-opacity-10 text-cyan-500'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs bg-cyan-500 text-white px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Ecosystem Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 mb-8">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">FRUITFUL ECOSYSTEM</h3>
          <div className="space-y-2">
            {ecosystemItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id)
                  setIsMobileOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
                  ${activePage === item.id
                    ? 'bg-orange-500 bg-opacity-10 text-orange-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">ADMIN PORTALS</h3>
          <div className="space-y-2">
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id)
                  setIsMobileOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
                  ${activePage === item.id
                    ? 'bg-cyan-500 bg-opacity-10 text-cyan-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
