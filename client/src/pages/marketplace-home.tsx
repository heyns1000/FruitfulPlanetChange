import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Search, ShoppingCart, Package, Shield, CreditCard, ChevronRight, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/marketplace/product-card';
import { CartDrawer } from '@/components/cart/cart-drawer';
import type { Brand, Sector } from '@shared/schema';

/**
 * Marketplace Home - Amazon-Style Landing Page
 * 
 * Beautiful, customer-facing marketplace homepage featuring:
 * - Hero section with search
 * - Featured categories (sectors)
 * - Featured products carousel
 * - Stats and trust indicators
 * - Payment methods
 */
export default function MarketplaceHome() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch sectors for category cards
  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ['/api/sectors'],
  });

  // Fetch featured products (first 10)
  const { data: productsResponse } = useQuery<{
    products: Brand[];
    total: number;
  }>({
    queryKey: ['/api/marketplace/products'],
    queryFn: async () => {
      const res = await fetch('/api/marketplace/products?limit=10&page=1');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  const featuredProducts = productsResponse?.products || [];
  const totalProducts = productsResponse?.total || 13713;

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/marketplace/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Navigate to products page with sector filter
  const handleCategoryClick = (sectorId: number) => {
    setLocation(`/marketplace/products?sectorId=${sectorId}`);
  };

  // Get sector emoji/icon
  const getSectorIcon = (sectorName: string): string => {
    const icons: Record<string, string> = {
      'Agriculture': '🌾',
      'Banking': '💰',
      'Creative': '🎨',
      'Technology': '💻',
      'Healthcare': '🏥',
      'Education': '📚',
      'Manufacturing': '🏭',
      'Retail': '🛍️',
      'Transportation': '🚚',
      'Energy': '⚡',
      'Real Estate': '🏢',
      'Finance': '💳',
    };
    
    // Find matching icon or default
    for (const [key, icon] of Object.entries(icons)) {
      if (sectorName.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return '📦';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Cart */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">FruitfulPlanet Marketplace</h1>
            </div>
            <CartDrawer />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to FruitfulPlanet
              <span className="block text-primary mt-2">Global Marketplace</span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-muted-foreground">
              Shop {totalProducts.toLocaleString()}+ Premium Technology Brands
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for brands, products, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8">
                  Search
                </Button>
              </div>
            </form>

            {/* Main CTA */}
            <div className="pt-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg"
                onClick={() => setLocation('/marketplace/products')}
              >
                Browse All Products
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Package className="h-10 w-10 text-primary" />
              </div>
              <div className="text-3xl font-bold">{totalProducts.toLocaleString()}+</div>
              <div className="text-sm text-muted-foreground">Premium Products</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <div className="text-3xl font-bold">{sectors.length}+</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Secure Checkout</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Browse by Category</h2>
            <p className="text-lg text-muted-foreground">
              Explore our extensive collection of premium brands
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {sectors.slice(0, 12).map((sector) => (
              <Card
                key={sector.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => handleCategoryClick(sector.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{getSectorIcon(sector.name)}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{sector.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {/* Count brands in this sector - approximate for now */}
                        {Math.floor(totalProducts / sectors.length)} products
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {sectors.length > 12 && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setLocation('/marketplace/products')}
              >
                View All Categories
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="h-6 w-6 text-primary fill-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Hand-picked premium brands for your business
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {featuredProducts.slice(0, 8).map((brand) => (
                  <ProductCard
                    key={brand.id}
                    brand={brand}
                    onViewDetails={() => setLocation(`/marketplace/products`)}
                  />
                ))}
              </div>

              <div className="text-center mt-10">
                <Button
                  size="lg"
                  onClick={() => setLocation('/marketplace/products')}
                >
                  View All Products
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto opacity-20 mb-4" />
              <p className="text-muted-foreground">Loading featured products...</p>
            </div>
          )}
        </div>
      </section>

      {/* Payment Methods Banner */}
      <section className="py-12 bg-card/50 border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold">We Accept</h3>
            </div>
            
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <Badge variant="outline" className="text-lg px-6 py-3">
                💳 PayPal
              </Badge>
              <Badge variant="outline" className="text-lg px-6 py-3">
                💰 PayFast
              </Badge>
            </div>
            
            <p className="text-muted-foreground">
              Secure payment processing with industry-leading providers
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">
              Start Shopping Today
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover premium technology brands and solutions for your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg"
                onClick={() => setLocation('/marketplace/products')}
              >
                Browse All Products
                <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg"
                onClick={() => setLocation('/sectors')}
              >
                Explore Categories
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
