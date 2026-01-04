/**
 * Shopping Cart API Endpoints
 * Implements complete cart management functionality
 */

import { Request, Response } from 'express';
import { db } from './db'; // Your database connection
import { carts, cartItems, products, orders, orderItems } from './schema';
import { eq, and, sql } from 'drizzle-orm';
import crypto from 'crypto';

/* Helper Functions */

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

function calculateCartTotal(items: any[]): { subtotal: number; total: number } {
  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.price) * item.quantity);
  }, 0);

  // TODO: Add tax and discount calculations
  const tax = 0;
  const discount = 0;
  const total = subtotal + tax - discount;

  return { subtotal, total };
}

/* Cart Management */

// Get or create cart for user/session
export async function getCart(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const sessionId = req.session.id || req.sessionID;

    if (!userId && !sessionId) {
      return res.status(400).json({ error: 'No user or session ID' });
    }

    // Find existing cart
    let cart;
    if (userId) {
      cart = await db.query.carts.findFirst({
        where: and(
          eq(carts.userId, userId),
          eq(carts.status, 'active')
        ),
        with: {
          items: {
            with: {
              product: true
            }
          }
        }
      });
    } else {
      cart = await db.query.carts.findFirst({
        where: and(
          eq(carts.sessionId, sessionId),
          eq(carts.status, 'active')
        ),
        with: {
          items: {
            with: {
              product: true
            }
          }
        }
      });
    }

    // Create new cart if none exists
    if (!cart) {
      const [newCart] = await db.insert(carts).values({
        userId: userId || null,
        sessionId: userId ? null : sessionId,
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }).returning();

      cart = { ...newCart, items: [] };
    }

    // Calculate totals
    const { subtotal, total } = calculateCartTotal(cart.items || []);

    res.json({
      cart,
      summary: {
        itemCount: cart.items?.length || 0,
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
      }
    });
  } catch (error) {
    console.error('Failed to get cart:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
}

// Add item to cart
export async function addToCart(req: Request, res: Response) {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = (req as any).user?.id;
    const sessionId = req.session.id || req.sessionID;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (quantity < 1 || quantity > 99) {
      return res.status(400).json({ error: 'Quantity must be between 1 and 99' });
    }

    // Get product
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, productId),
        eq(products.isActive, true)
      )
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get or create cart
    let cart;
    if (userId) {
      cart = await db.query.carts.findFirst({
        where: and(
          eq(carts.userId, userId),
          eq(carts.status, 'active')
        )
      });
    } else {
      cart = await db.query.carts.findFirst({
        where: and(
          eq(carts.sessionId, sessionId),
          eq(carts.status, 'active')
        )
      });
    }

    if (!cart) {
      const [newCart] = await db.insert(carts).values({
        userId: userId || null,
        sessionId: userId ? null : sessionId,
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }).returning();
      cart = newCart;
    }

    // Check if item already in cart
    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productId, productId)
      )
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = Math.min(existingItem.quantity + quantity, 99);
      await db.update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      // Add new item
      await db.insert(cartItems).values({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
      });
    }

    // Update cart timestamp
    await db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cart.id));

    // Return updated cart
    const updatedCart = await db.query.carts.findFirst({
      where: eq(carts.id, cart.id),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });

    const { subtotal, total } = calculateCartTotal(updatedCart.items || []);

    res.json({
      cart: updatedCart,
      summary: {
        itemCount: updatedCart.items?.length || 0,
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
      }
    });
  } catch (error) {
    console.error('Failed to add to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
}

// Update cart item quantity
export async function updateCartItem(req: Request, res: Response) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = (req as any).user?.id;
    const sessionId = req.session.id || req.sessionID;

    if (!quantity || quantity < 0 || quantity > 99) {
      return res.status(400).json({ error: 'Quantity must be between 0 and 99' });
    }

    // Get cart item
    const item = await db.query.cartItems.findFirst({
      where: eq(cartItems.id, itemId),
      with: {
        cart: true
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Verify ownership
    if (userId && item.cart.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (!userId && item.cart.sessionId !== sessionId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update quantity (0 = remove)
    if (quantity === 0) {
      await db.delete(cartItems).where(eq(cartItems.id, itemId));
    } else {
      await db.update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, itemId));
    }

    // Update cart timestamp
    await db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, item.cart.id));

    // Return updated cart
    const updatedCart = await db.query.carts.findFirst({
      where: eq(carts.id, item.cart.id),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });

    const { subtotal, total } = calculateCartTotal(updatedCart.items || []);

    res.json({
      cart: updatedCart,
      summary: {
        itemCount: updatedCart.items?.length || 0,
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
      }
    });
  } catch (error) {
    console.error('Failed to update cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
}

// Remove item from cart
export async function removeFromCart(req: Request, res: Response) {
  try {
    const { itemId } = req.params;
    const userId = (req as any).user?.id;
    const sessionId = req.session.id || req.sessionID;

    // Get cart item
    const item = await db.query.cartItems.findFirst({
      where: eq(cartItems.id, itemId),
      with: {
        cart: true
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Verify ownership
    if (userId && item.cart.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (!userId && item.cart.sessionId !== sessionId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete item
    await db.delete(cartItems).where(eq(cartItems.id, itemId));

    // Update cart timestamp
    await db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, item.cart.id));

    // Return updated cart
    const updatedCart = await db.query.carts.findFirst({
      where: eq(carts.id, item.cart.id),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });

    const { subtotal, total } = calculateCartTotal(updatedCart.items || []);

    res.json({
      cart: updatedCart,
      summary: {
        itemCount: updatedCart.items?.length || 0,
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
      }
    });
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
}

// Clear cart
export async function clearCart(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const sessionId = req.session.id || req.sessionID;

    // Find cart
    let cart;
    if (userId) {
      cart = await db.query.carts.findFirst({
        where: and(
          eq(carts.userId, userId),
          eq(carts.status, 'active')
        )
      });
    } else {
      cart = await db.query.carts.findFirst({
        where: and(
          eq(carts.sessionId, sessionId),
          eq(carts.status, 'active')
        )
      });
    }

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Delete all items
    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

    // Update cart timestamp
    await db.update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cart.id));

    res.json({
      cart: { ...cart, items: [] },
      summary: {
        itemCount: 0,
        subtotal: '0.00',
        total: '0.00',
      }
    });
  } catch (error) {
    console.error('Failed to clear cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
}

// Checkout - convert cart to order
export async function checkout(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const sessionId = req.session.id || req.sessionID;
    const { billingEmail, billingName, billingAddress } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Must be logged in to checkout' });
    }

    if (!billingEmail) {
      return res.status(400).json({ error: 'Billing email is required' });
    }

    // Get cart with items
    const cart = await db.query.carts.findFirst({
      where: and(
        eq(carts.userId, userId),
        eq(carts.status, 'active')
      ),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate totals
    const { subtotal, total } = calculateCartTotal(cart.items);

    // Create order
    const [order] = await db.insert(orders).values({
      orderNumber: generateOrderNumber(),
      userId,
      status: 'pending',
      subtotal: subtotal.toFixed(2),
      tax: '0.00',
      discount: '0.00',
      total: total.toFixed(2),
      currency: 'USD',
      billingEmail,
      billingName,
      billingAddress,
    }).returning();

    // Create order items
    for (const item of cart.items) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: (parseFloat(item.price) * item.quantity).toFixed(2),
      });
    }

    // Mark cart as converted
    await db.update(carts)
      .set({ status: 'converted', updatedAt: new Date() })
      .where(eq(carts.id, cart.id));

    // Return order for payment processing
    const fullOrder = await db.query.orders.findFirst({
      where: eq(orders.id, order.id),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });

    res.json({
      order: fullOrder,
      paymentRequired: true,
      amount: total.toFixed(2),
    });
  } catch (error) {
    console.error('Failed to checkout:', error);
    res.status(500).json({ error: 'Failed to checkout' });
  }
}

// Merge guest cart with user cart on login
export async function mergeCart(userId: string, sessionId: string) {
  try {
    // Get user cart
    const userCart = await db.query.carts.findFirst({
      where: and(
        eq(carts.userId, userId),
        eq(carts.status, 'active')
      )
    });

    // Get session cart
    const sessionCart = await db.query.carts.findFirst({
      where: and(
        eq(carts.sessionId, sessionId),
        eq(carts.status, 'active')
      ),
      with: {
        items: true
      }
    });

    if (!sessionCart || !sessionCart.items || sessionCart.items.length === 0) {
      return; // Nothing to merge
    }

    // Create user cart if doesn't exist
    let targetCart = userCart;
    if (!targetCart) {
      const [newCart] = await db.insert(carts).values({
        userId,
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }).returning();
      targetCart = newCart;
    }

    // Merge items
    for (const item of sessionCart.items) {
      // Check if item exists in user cart
      const existing = await db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.cartId, targetCart.id),
          eq(cartItems.productId, item.productId)
        )
      });

      if (existing) {
        // Update quantity
        const newQuantity = Math.min(existing.quantity + item.quantity, 99);
        await db.update(cartItems)
          .set({ quantity: newQuantity })
          .where(eq(cartItems.id, existing.id));
      } else {
        // Add new item
        await db.insert(cartItems).values({
          cartId: targetCart.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      }
    }

    // Delete session cart
    await db.delete(cartItems).where(eq(cartItems.cartId, sessionCart.id));
    await db.delete(carts).where(eq(carts.id, sessionCart.id));

    console.log(`Merged cart: ${sessionCart.items.length} items from session to user ${userId}`);
  } catch (error) {
    console.error('Failed to merge cart:', error);
    // Don't throw - cart merge is non-critical
  }
}
