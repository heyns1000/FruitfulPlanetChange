import { Switch, Route } from "wouter"
import { queryClient } from "./lib/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Sidebar } from "@/components/portal/sidebar"
import { GlobalPulse } from "@/components/portal/global-pulse"
import { SeedwaveAdmin } from "@/components/portal/seedwave-admin"
import { EcosystemExplorer } from "@/components/portal/ecosystem-explorer"
import { LegalHub } from "@/components/portal/legal-hub"
import { PaymentHub } from "@/components/portal/payment-hub"
import { VaultMeshCheckout } from "@/components/portal/vaultmesh-checkout"
import PortalHome from "@/pages/portal-home"
import NotFound from "@/pages/not-found"
import { useState } from "react"

// Page router component that renders content based on active page
function PageRouter({ activePage }: { activePage: string }) {
  switch (activePage) {
    case "home":
    case "brands":
    case "sectors":
    case "marketplace":
    case "analytics":
    case "integrations":
    case "settings":
      return <PortalHome />
    case "global-pulse":
      return (
        <div className="p-8">
          <GlobalPulse />
        </div>
      )
    case "seedwave-admin":
      return (
        <div className="p-8">
          <SeedwaveAdmin />
        </div>
      )
    case "ecosystem-explorer":
      return (
        <div className="p-8">
          <EcosystemExplorer />
        </div>
      )
    case "legal-hub":
      return (
        <div className="p-8">
          <LegalHub />
        </div>
      )
    case "payment-hub":
      return (
        <div className="p-8">
          <PaymentHub />
        </div>
      )
    case "vaultmesh-checkout":
      return (
        <div className="p-8">
          <VaultMeshCheckout />
        </div>
      )
    case "interns":
      return (
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Intern Management Portal</h1>
            <p className="text-muted-foreground">Coming soon - Comprehensive intern training and management system</p>
          </div>
        </div>
      )
    case "compliance":
      return (
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Compliance Dashboard</h1>
            <p className="text-muted-foreground">Coming soon - Regulatory compliance monitoring and reporting</p>
          </div>
        </div>
      )
    default:
      return <NotFound />
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={PortalHome} />
      <Route path="/portal-home" component={PortalHome} />
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  const [activePage, setActivePage] = useState("home")

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="seedwave-ui-theme">
        <TooltipProvider>
          <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar activePage={activePage} onPageChange={setActivePage} />
            <main className="flex-1 ml-0 md:ml-80 transition-all duration-300">
              <PageRouter activePage={activePage} />
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
