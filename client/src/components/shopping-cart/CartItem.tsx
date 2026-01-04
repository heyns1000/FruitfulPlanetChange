/**
 * CartItem Component
 *
 * Displays an individual item in the shopping cart with quantity controls.
 */

import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart, CartItem as CartItemType } from './useCart';
import { useState } from 'react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, loading } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return;

    setQuantity(newQuantity);
    setUpdating(true);

    try {
      await updateQuantity(item.id, newQuantity);
    } catch (error) {
      // Revert on error
      setQuantity(item.quantity);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setUpdating(true);
    try {
      await removeItem(item.id);
    } catch (error) {
      setUpdating(false);
    }
  };

  const itemTotal = item.price * quantity;

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Product Image */}
      <div className="flex-shrink-0">
        {item.productImage ? (
          <img
            src={item.productImage}
            alt={item.productName}
            className="w-20 h-20 object-cover rounded"
          />
        ) : (
          <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{item.productName}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          ${item.price.toFixed(2)} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={loading || updating || quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <Input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) {
                handleQuantityChange(val);
              }
            }}
            className="w-16 h-8 text-center"
            disabled={loading || updating}
          />

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={loading || updating || quantity >= 99}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-2 text-destructive hover:text-destructive"
            onClick={handleRemove}
            disabled={loading || updating}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Item Total */}
      <div className="flex-shrink-0 text-right">
        <p className="font-medium">${itemTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}

// Import missing ShoppingCart icon
import { ShoppingCart } from 'lucide-react';
