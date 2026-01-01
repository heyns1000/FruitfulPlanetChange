import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useLocation } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

/**
 * Cart Summary Component
 * 
 * Displays cart totals and checkout button
 * Calculates subtotal, tax, shipping, and total
 */
export function CartSummary() {
  const { getTotalPrice, getTotalItems } = useCart();
  const [, setLocation] = useLocation();

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.15; // 15% VAT
  const shipping = 0; // Free shipping for now
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    setLocation('/checkout');
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({getTotalItems()} items)
          </span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (15%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span className="text-lg">${total.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
        >
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {/* Payment Methods */}
        <div className="pt-3 border-t">
          <p className="text-xs text-center text-muted-foreground mb-2">
            We accept
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
              PayPal
            </div>
            <div className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-700 rounded">
              PayFast
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
