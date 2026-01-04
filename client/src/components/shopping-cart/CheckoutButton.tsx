/**
 * CheckoutButton Component
 *
 * Initiates the checkout process and redirects to payment.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from './useCart';
import { Loader2 } from 'lucide-react';

export function CheckoutButton() {
  const { cart, loading } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const data = await response.json();

      // Redirect to checkout page with order ID
      if (data.orderId) {
        navigate(`/checkout/${data.orderId}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to proceed to checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleCheckout}
      disabled={loading || isCheckingOut || isEmpty}
    >
      {isCheckingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
    </Button>
  );
}
