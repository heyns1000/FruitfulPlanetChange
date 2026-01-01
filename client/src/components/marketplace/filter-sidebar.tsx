import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Sector } from '@shared/schema';

interface FilterSidebarProps {
  sectorId?: number;
  minPrice?: number;
  maxPrice?: number;
  integration?: string;
  onSectorChange: (sectorId: number | undefined) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onIntegrationChange: (integration: string | undefined) => void;
  onClearFilters: () => void;
}

/**
 * Filter Sidebar Component
 * 
 * Provides filtering options for marketplace products
 * - Sector/Category filter
 * - Price range slider
 * - Integration type filter
 */
export function FilterSidebar({
  sectorId,
  minPrice = 0,
  maxPrice = 199,
  integration,
  onSectorChange,
  onPriceRangeChange,
  onIntegrationChange,
  onClearFilters,
}: FilterSidebarProps) {
  // Fetch sectors for filter
  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ['/api/sectors'],
  });

  const integrationTypes = [
    'VaultMesh™',
    'HotStack',
    'FAA.ZONE™',
    'SecureSign™',
    'Baobab',
    'CodeNest',
    'OmniGrid',
  ];

  const hasActiveFilters = sectorId || integration || minPrice > 0 || maxPrice < 199;

  return (
    <Card className="sticky top-4">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </CardTitle>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sector/Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="sector-filter">Category</Label>
          <Select
            value={sectorId?.toString() || 'all'}
            onValueChange={(value) =>
              onSectorChange(value === 'all' ? undefined : parseInt(value))
            }
          >
            <SelectTrigger id="sector-filter">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id.toString()}>
                  {sector.emoji} {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${minPrice}</span>
            <span>${maxPrice}+</span>
          </div>
          <Slider
            min={0}
            max={199}
            step={10}
            value={[minPrice, maxPrice]}
            onValueChange={([min, max]) => onPriceRangeChange(min, max)}
            className="mt-2"
          />
          <div className="text-xs text-center text-muted-foreground mt-2">
            Showing products from ${minPrice} to ${maxPrice}/month
          </div>
        </div>

        {/* Integration Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="integration-filter">Integration Type</Label>
          <Select
            value={integration || 'all'}
            onValueChange={(value) =>
              onIntegrationChange(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger id="integration-filter">
              <SelectValue placeholder="All integrations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Integrations</SelectItem>
              {integrationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Status Filter */}
        <div className="space-y-3 pt-3 border-t">
          <Label>Product Status</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="active" defaultChecked disabled />
              <label
                htmlFor="active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active Products
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
