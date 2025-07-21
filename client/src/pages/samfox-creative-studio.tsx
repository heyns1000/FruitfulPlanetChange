import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Sparkles, 
  Download, 
  Eye, 
  Heart,
  Star,
  Brush,
  Image,
  Layout,
  Globe,
  Code,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import Madiba artwork
import MadibaMockPath from '@/assets/Madiba_mock.png';

export default function SamFoxCreativeStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const artworkGallery = [
    {
      id: 'madiba-portrait',
      title: 'Madiba Portrait Collection',
      description: 'Beautiful artistic interpretation featuring warm coral tones and intricate details',
      image: MadibaMockPath,
      category: 'Portrait Art',
      medium: 'Digital Illustration',
      dimensions: '841 x 1189 px',
      style: 'Contemporary Portrait',
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3']
    }
  ];

  const dashboardTemplates = [
    {
      id: 'global-dashboard',
      title: 'Fruitful™ Global Dashboard',
      description: 'Comprehensive multi-canvas dashboard with elegant dark theme',
      preview: '/api/templates/samfox/global-dashboard',
      features: ['Dark Theme', 'Multi-Canvas Layout', 'Real-time Analytics', 'Interactive Charts'],
      category: 'Dashboard',
      complexity: 'Advanced'
    },
    {
      id: 'sector-index',
      title: 'Global Sector Index',
      description: 'Beautiful sector navigation with sophisticated styling',
      preview: '/api/templates/samfox/sector-index',
      features: ['Sector Navigation', 'Clean Layout', 'Responsive Design', 'Professional Styling'],
      category: 'Navigation',
      complexity: 'Intermediate'
    },
    {
      id: 'payment-portal',
      title: 'Fruitful Payment Portal',
      description: 'Elegant payment processing interface with PayPal integration',
      preview: '/api/templates/samfox/payment-portal',
      features: ['PayPal Integration', 'Secure Processing', 'Clean UI', 'Mobile Responsive'],
      category: 'E-commerce',
      complexity: 'Advanced'
    },
    {
      id: 'heritage-portal',
      title: 'Ancestortag Heritage Portal',
      description: 'Thoughtful heritage and ancestry exploration interface',
      preview: '/api/templates/samfox/heritage-portal',
      features: ['Heritage Theme', 'Genealogy Support', 'Cultural Elements', 'Family Trees'],
      category: 'Cultural',
      complexity: 'Intermediate'
    }
  ];

  const designAssets = [
    {
      id: 'color-palettes',
      title: 'SamFox Color Palettes',
      description: 'Curated color schemes with pastel and vibrant combinations',
      count: 15,
      type: 'Color System'
    },
    {
      id: 'component-library',
      title: 'UI Component Library',
      description: 'Reusable interface components with consistent styling',
      count: 28,
      type: 'Components'
    },
    {
      id: 'layout-templates',
      title: 'Layout Templates',
      description: 'Professional page layouts for various use cases',
      count: 12,
      type: 'Templates'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 via-purple-400/20 to-pink-400/20 dark:from-rose-600/30 dark:via-purple-600/30 dark:to-pink-600/30" />
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="p-3 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl shadow-lg">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SamFox Creative Studio
              </h1>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Beautiful artwork, elegant dashboard designs, and professional templates crafted with love and artistic vision
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Badge variant="outline" className="px-4 py-2 bg-white/80 dark:bg-gray-800/80">
                <Brush className="w-4 h-4 mr-2" />
                Digital Artist
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-white/80 dark:bg-gray-800/80">
                <Layout className="w-4 h-4 mr-2" />
                UI/UX Designer
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-white/80 dark:bg-gray-800/80">
                <Sparkles className="w-4 h-4 mr-2" />
                Creative Director
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="artwork" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
            <TabsTrigger value="artwork" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Artwork Gallery
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Dashboard Templates
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Design Assets
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          {/* Artwork Gallery */}
          <TabsContent value="artwork" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Artwork Gallery</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Featuring the beautiful Madiba portrait and other artistic creations
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {artworkGallery.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <img 
                        src={artwork.image} 
                        alt={artwork.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-semibold mb-1">{artwork.title}</h3>
                        <p className="text-sm text-gray-200">{artwork.medium}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {artwork.description}
                          </p>
                        </div>
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{artwork.category}</Badge>
                          <Badge variant="outline">{artwork.style}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {artwork.colors.map((color, i) => (
                            <div 
                              key={i}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Dashboard Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Dashboard Templates</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Professional dashboard designs with elegant styling and sophisticated functionality
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{template.title}</CardTitle>
                          <CardDescription className="text-base">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge variant={template.complexity === 'Advanced' ? 'default' : 'secondary'}>
                          {template.complexity}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Features:</p>
                          <div className="flex flex-wrap gap-2">
                            {template.features.map((feature, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Template
                          </Button>
                          <Button size="sm" variant="outline">
                            <Code className="w-4 h-4 mr-2" />
                            View Code
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Design Assets */}
          <TabsContent value="assets" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Design Assets</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Reusable design components, color palettes, and styling resources
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {designAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Layers className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2">{asset.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {asset.description}
                      </p>
                      
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <Badge variant="secondary">{asset.count} items</Badge>
                        <Badge variant="outline">{asset.type}</Badge>
                      </div>
                      
                      <Button size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Pack
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Portfolio */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Creative Portfolio</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A showcase of artistic vision, technical expertise, and creative excellence
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4">About SamFox Studio</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    SamFox Creative Studio represents the intersection of artistic vision and technical excellence. 
                    Specializing in digital art, user interface design, and comprehensive dashboard solutions, 
                    the studio brings together creativity and functionality in every project.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    From the beautiful Madiba portrait showcasing artistic talent to sophisticated dashboard 
                    templates demonstrating technical prowess, each creation reflects a commitment to quality 
                    and attention to detail.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-3">Specializations</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Brush className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Digital Art</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">UI/UX Design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Dashboard Design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Creative Direction</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={MadibaMockPath} 
                    alt="Featured Artwork - Madiba Portrait"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-xl font-bold mb-2">Featured: Madiba Portrait</h4>
                    <p className="text-sm text-gray-200">Digital illustration showcasing artistic mastery</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}