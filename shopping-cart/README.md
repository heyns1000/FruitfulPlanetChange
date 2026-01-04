# Shopping Cart Implementation

Complete shopping cart system for FruitfulPlanetChange marketplace.

## Components

### Backend (API)

- **schema.ts** - Database schema (10 tables)
  - `users`, `products`, `carts`, `cartItems`, `orders`, `orderItems`
  - `downloads`, `downloadLogs`, `licenses`, `licenseActivations`

- **cart-api.ts** - API endpoints
  - `GET /api/cart` - Get cart
  - `POST /api/cart/items` - Add to cart
  - `PATCH /api/cart/items/:id` - Update quantity
  - `DELETE /api/cart/items/:id` - Remove item
  - `DELETE /api/cart` - Clear cart
  - `POST /api/cart/checkout` - Create order
  - `POST /api/cart/merge` - Merge guest cart on login

### Frontend (UI Components)

- **useCart.tsx** - React context and hooks for cart state
- **CartIcon.tsx** - Cart icon with item count badge
- **CartDrawer.tsx** - Slide-out cart panel
- **CartItem.tsx** - Individual cart item with controls
- **CartSummary.tsx** - Cart totals display
- **CheckoutButton.tsx** - Checkout initiation

## Integration Steps

### 1. Install Dependencies

```bash
npm install @tanstack/react-query lucide-react
```

### 2. Set Up Database

Run the schema migration:

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './shopping-cart/schema';

const db = drizzle(process.env.DATABASE_URL!, { schema });

// Run migrations
await db.execute(schema);
```

### 3. Add Cart Provider

In your root App component:

```tsx
import { CartProvider } from './shopping-cart/useCart';

function App() {
  return (
    <CartProvider>
      {/* Your app content */}
    </CartProvider>
  );
}
```

### 4. Add Cart to Header

```tsx
import { useState } from 'react';
import { CartIcon } from './shopping-cart/CartIcon';
import { CartDrawer } from './shopping-cart/CartDrawer';

function Header() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header>
      {/* Other header content */}
      <CartIcon onClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
```

### 5. Add to Cart from Product Pages

```tsx
import { useCart } from './shopping-cart/useCart';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      // Show success toast
    } catch (error) {
      // Show error toast
    }
  };

  return (
    <Button onClick={handleAddToCart}>
      Add to Cart
    </Button>
  );
}
```

### 6. Register API Routes

In your Express server:

```typescript
import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout,
} from './shopping-cart/cart-api';

const app = express();

app.get('/api/cart', getCart);
app.post('/api/cart/items', addToCart);
app.patch('/api/cart/items/:id', updateCartItem);
app.delete('/api/cart/items/:id', removeFromCart);
app.delete('/api/cart', clearCart);
app.post('/api/cart/checkout', checkout);
```

## Features

- ✅ Add/remove items
- ✅ Update quantities
- ✅ Guest cart support (session-based)
- ✅ User cart support (authenticated)
- ✅ Cart merge on login
- ✅ Auto-expiration (30 days)
- ✅ Real-time totals calculation
- ✅ Responsive UI with shadcn/ui
- ✅ Loading states
- ✅ Error handling

## Security

All cart operations are protected by the security middleware:

- Rate limiting (100 req/15min general, 10 payments/hour)
- CSRF protection
- Input validation
- Session management

See `security-fixes/security-middleware.ts` for details.

## Testing

1. Add item to cart as guest
2. Log in - cart should merge
3. Update quantities
4. Remove items
5. Clear cart
6. Proceed to checkout

## Next Steps

- [ ] Implement checkout page
- [ ] Add PayPal integration
- [ ] Add download system
- [ ] Add license management
- [ ] Add order history
- [ ] Add email notifications
