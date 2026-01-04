/**
 * CartIcon Component
 *
 * Displays a shopping cart icon with item count badge in the header.
 * Clicking opens the cart drawer.
 */

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from './useCart';

interface CartIconProps {
  onClick: () => void;
}

export function CartIcon({ onClick }: CartIconProps) {
  const { cart, loading } = useCart();

  const itemCount = cart?.summary.itemCount || 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onClick}
      disabled={loading}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Button>
  );
}
