import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart, type CartItem as CartItemType } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';

interface CartItemProps {
  item: CartItemType;
}

/**
 * Individual Cart Item Component
 * 
 * Displays a single cart item with quantity controls
 * and remove button
 */
export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        {/* Product Image Placeholder */}
        <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">📦</span>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{item.name}</h4>
          {item.integration && (
            <Badge variant="outline" className="mt-1 text-xs">
              {item.integration}
            </Badge>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium">
              ${item.price.toFixed(2)}
            </span>
            
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="w-8 text-center text-sm font-medium">
                {item.quantity}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleIncrease}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Item Total */}
      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {item.quantity} × ${item.price.toFixed(2)}
        </span>
        <span className="font-semibold">
          ${(item.quantity * item.price).toFixed(2)}
        </span>
      </div>
    </Card>
  );
}
