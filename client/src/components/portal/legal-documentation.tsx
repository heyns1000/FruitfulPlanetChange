import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DocumentViewer } from "./document-viewer"
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Shield,
  BookOpen,
  Gavel,
  Building2,
  Globe
} from "lucide-react"

interface LegalDocument {
  id: string
  title: string
  type: string
  category: string
  description: string
  lastUpdated: string
  author: string
  status: string
  size: string
  priority: "high" | "medium" | "low"
}

export function LegalDocumentation() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewingDocument, setViewingDocument] = useState<LegalDocument | null>(null)

  // Legal documents from your repository structure
  const legalDocuments: LegalDocument[] = [
    {
      id: "fruitful-holdings-nda",
      title: "Fruitful Holdings NDA",
      type: "PDF",
      category: "contracts",
      description: "Non-disclosure agreement for Fruitful Holdings operations and partnerships",
      lastUpdated: "July 19, 2025",
      author: "Legal Team",
      status: "active",
      size: "1.7 MB",
      priority: "high"
    },
    {
      id: "securesign-portal",
      title: "SecureSign™ Portal Documentation",
      type: "HTML",
      category: "technical",
      description: "Complete SecureSign™ NDA portal setup and integration guide",
      lastUpdated: "July 19, 2025",
      author: "Development Team", 
      status: "active",
      size: "101 KB",
      priority: "high"
    },
    {
      id: "seedwave-deployment",
      title: "Seedwave™ Deployment Manual",
      type: "HTML",
      category: "technical",
      description: "Comprehensive deployment manual for Seedwave™ portal infrastructure",
      lastUpdated: "July 19, 2025",
      author: "Operations Team",
      status: "active", 
      size: "67 KB",
      priority: "high"
    },
    {
      id: "faa-zone-minutes",
      title: "FAA Zone Meeting Minutes",
      type: "HTML",
      category: "minutes",
      description: "Minutes of meeting for FAA zone integration and setup",
      lastUpdated: "July 19, 2025",
      author: "Project Management",
      status: "archived",
      size: "33 KB",
      priority: "medium"
    },
    {
      id: "firebase-integration",
      title: "Firebase Core Minutes",
      type: "HTML",
      category: "minutes",
      description: "Firebase integration meeting notes and technical decisions",
      lastUpdated: "July 19, 2025",
      author: "Development Team",
      status: "active",
      size: "22 KB",
      priority: "medium"
    },
    {
      id: "paypal-setup",
      title: "PayPal Integration Guide",
      type: "HTML",
      category: "technical",
      description: "PayPal payment integration setup and configuration guide",
      lastUpdated: "July 19, 2025",
      author: "Payment Team",
      status: "active",
      size: "23 KB",
      priority: "medium"
    },
    {
      id: "repository-index",
      title: "Repository & Legal Hub Index",
      type: "HTML",
      category: "index",
      description: "Main index for repository management and legal documentation",
      lastUpdated: "July 19, 2025",
      author: "Legal Team",
      status: "active",
      size: "126 KB",
      priority: "high"
    },
    {
      id: "codenest-settings",
      title: "CodeNest Settings & Configuration",
      type: "HTML", 
      category: "technical",
      description: "CodeNest development environment setup and configuration",
      lastUpdated: "July 19, 2025",
      author: "Development Team",
      status: "active",
      size: "45 KB",
      priority: "low"
    }
  ]

  const categories = [
    { id: "all", label: "All Documents", icon: FileText },
    { id: "contracts", label: "Contracts & NDAs", icon: Gavel },
    { id: "technical", label: "Technical Docs", icon: BookOpen },
    { id: "minutes", label: "Meeting Minutes", icon: Clock },
    { id: "index", label: "Index & Reference", icon: Building2 }
  ]

  const filteredDocuments = legalDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate statistics
  const getStatistics = () => {
    return {
      totalDocuments: legalDocuments.length,
      activeContracts: legalDocuments.filter(d => d.status === 'active' && d.category === 'contracts').length,
      technicalDocs: legalDocuments.filter(d => d.category === 'technical').length,
      meetingMinutes: legalDocuments.filter(d => d.category === 'minutes').length
    }
  }

  const statistics = getStatistics()

  // Handle document viewing
  const handleViewDocument = (doc: LegalDocument) => {
    // Open document within the portal interface
    setViewingDocument(doc)
  }

  // Handle document download
  const handleDownloadDocument = (doc: LegalDocument) => {
    // Simulate download - in real implementation, this would fetch the actual file
    const link = document.createElement('a')
    link.href = `/api/legal-documents/${doc.id}/download`
    link.download = `${doc.title}.${doc.type.toLowerCase()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "draft": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // If viewing a specific document, show the document viewer
  if (viewingDocument) {
    return (
      <DocumentViewer 
        document={viewingDocument} 
        onBack={() => setViewingDocument(null)} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              📋 Legal Documentation Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive legal documentation, contracts, meeting minutes, and technical guides
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              VaultMesh™ Secured
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <FileText className="w-3 h-3 mr-1" />
              {statistics.totalDocuments} Documents
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search legal documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Documents</p>
                  <p className="text-2xl font-bold">{statistics.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Contracts</p>
                  <p className="text-2xl font-bold">{statistics.activeContracts}</p>
                </div>
                <Gavel className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Technical Docs</p>
                  <p className="text-2xl font-bold">{statistics.technicalDocs}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Meeting Minutes</p>
                  <p className="text-2xl font-bold">{statistics.meetingMinutes}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription className="mt-2">{doc.description}</CardDescription>
                  </div>
                  <Badge className={getPriorityColor(doc.priority)}>
                    {doc.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <Badge variant="outline">{doc.type}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Size:</span>
                    <span>{doc.size}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{doc.author}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{doc.lastUpdated}</span>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                      onClick={() => handleDownloadDocument(doc)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}