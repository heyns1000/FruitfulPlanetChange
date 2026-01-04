/**
 * CartDrawer Component
 *
 * Slide-out drawer that displays the shopping cart contents.
 * Shows all cart items, summary, and checkout button.
 */

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useCart } from './useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { CheckoutButton } from './CheckoutButton';
import { ShoppingCart, Trash2 } from 'lucide-react';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, loading, clearCart } = useCart();

  const isEmpty = !cart || cart.items.length === 0;

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {isEmpty
              ? 'Your cart is empty'
              : `${cart.summary.itemCount} item${cart.summary.itemCount !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-2">Add items to get started</p>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-0">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            {/* Cart Summary and Actions */}
            <div className="border-t pt-4 space-y-4">
              <CartSummary />

              <div className="space-y-2">
                <CheckoutButton />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
