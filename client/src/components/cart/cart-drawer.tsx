import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';
import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Cart Drawer Component
 * 
 * Slide-out panel for shopping cart
 * Displays cart items, summary, and checkout button
 */
export function CartDrawer() {
  const { items, getTotalItems, loadCart } = useCart();
  const itemCount = getTotalItems();

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col gap-4 mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-muted-foreground">
              <ShoppingCart className="h-16 w-16 opacity-20" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Your cart is empty</h3>
                <p className="text-sm">Add some products to get started!</p>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </ScrollArea>

              <CartSummary />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
