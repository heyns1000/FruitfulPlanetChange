/**
 * CartSummary Component
 *
 * Displays the cart totals including subtotal, tax, and total.
 */

import { Separator } from '@/components/ui/separator';
import { useCart } from './useCart';

export function CartSummary() {
  const { cart } = useCart();

  if (!cart || !cart.summary) {
    return null;
  }

  const { subtotal, tax, total, itemCount } = cart.summary;

  return (
    <div className="space-y-3 pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tax</span>
        <span className="font-medium">${tax.toFixed(2)}</span>
      </div>

      <Separator />

      <div className="flex justify-between text-base font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
