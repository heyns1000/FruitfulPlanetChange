import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Search, Grid3x3, List, Loader2, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/marketplace/product-card';
import { FilterSidebar } from '@/components/marketplace/filter-sidebar';
import { CartDrawer } from '@/components/cart/cart-drawer';
import type { Brand } from '@shared/schema';

/**
 * Marketplace Products Page
 * 
 * GitHub Marketplace-style product listing
 * with search, filters, and cart integration
 */
export default function MarketplaceProducts() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorId, setSectorId] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(199);
  const [integration, setIntegration] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>('popular');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const limit = 25;

  // Build query params
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (searchQuery) queryParams.set('search', searchQuery);
  if (sectorId) queryParams.set('sectorId', sectorId.toString());
  if (minPrice > 0) queryParams.set('minPrice', minPrice.toString());
  if (maxPrice < 199) queryParams.set('maxPrice', maxPrice.toString());
  if (integration) queryParams.set('integration', integration);

  // Fetch products
  const { data: response, isLoading } = useQuery<{
    products: Brand[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ['/api/marketplace/products', queryParams.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/marketplace/products?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  const products = response?.products || [];
  const totalPages = response?.totalPages || 1;
  const totalProducts = response?.total || 0;

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sectorId, minPrice, maxPrice, integration]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSectorId(undefined);
    setMinPrice(0);
    setMaxPrice(199);
    setIntegration(undefined);
    setPage(1);
  };

  const handleViewDetails = (brand: Brand) => {
    setLocation(`/marketplace/product/${brand.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Global Marketplace</h1>
                <p className="text-sm text-muted-foreground">
                  {totalProducts.toLocaleString()}+ brands available
                </p>
              </div>
            </div>

            {/* Cart */}
            <CartDrawer />
          </div>

          {/* Search Bar */}
          <div className="mt-4 flex gap-3 items-center">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort and View Mode */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
              <TabsList>
                <TabsTrigger value="grid">
                  <Grid3x3 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Filter Sidebar */}
          <aside className="hidden lg:block">
            <FilterSidebar
              sectorId={sectorId}
              minPrice={minPrice}
              maxPrice={maxPrice}
              integration={integration}
              onSectorChange={setSectorId}
              onPriceRangeChange={(min, max) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
              onIntegrationChange={setIntegration}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Products Grid */}
          <main>
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                Showing {products.length} of {totalProducts.toLocaleString()} products
              </div>
              {searchQuery && (
                <Badge variant="secondary">
                  Search: "{searchQuery}"
                </Badge>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <div className="text-center py-20">
                <Package className="h-16 w-16 mx-auto opacity-20 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            )}

            {/* Products Grid/List */}
            {!isLoading && products.length > 0 && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {products.map((brand) => (
                  <ProductCard
                    key={brand.id}
                    brand={brand}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && <span className="px-2">...</span>}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
