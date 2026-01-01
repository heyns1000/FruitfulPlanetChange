import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ExternalLink, Star } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Brand } from '@shared/schema';

interface ProductCardProps {
  brand: Brand;
  onViewDetails?: (brand: Brand) => void;
}

/**
 * Product Card Component
 * 
 * Displays a product card with brand information,
 * price, and add to cart button
 * 
 * Styled like GitHub Marketplace product cards
 */
export function ProductCard({ brand, onViewDetails }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  // Extract price from metadata or use default
  const price = brand.metadata && typeof brand.metadata === 'object' && 'price' in brand.metadata
    ? Number(brand.metadata.price)
    : 29.99;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);

    try {
      await addItem(brand, 1);
      
      toast({
        title: '✅ Added to Cart',
        description: `${brand.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(brand);
    }
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={handleViewDetails}
    >
      {/* Product Image Placeholder */}
      <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
        <div className="text-6xl opacity-50">📦</div>
        
        {/* Status Badge */}
        <Badge 
          variant={brand.status === 'active' ? 'default' : 'secondary'}
          className="absolute top-2 right-2"
        >
          {brand.status}
        </Badge>
      </div>

      <CardHeader className="flex-1">
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {brand.name}
        </CardTitle>
        
        {brand.description && (
          <CardDescription className="line-clamp-2">
            {brand.description}
          </CardDescription>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {brand.integration && (
            <Badge variant="outline" className="text-xs">
              {brand.integration}
            </Badge>
          )}
          {brand.isCore && (
            <Badge variant="secondary" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              Core
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 mt-auto">
        {/* Price and Actions */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold">${price.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">per month</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={isAdding || brand.status !== 'active'}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
