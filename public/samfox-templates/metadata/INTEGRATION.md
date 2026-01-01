# SamFox Templates Integration Guide

Complete integration guide for implementing SamFox Creative Studio templates into FruitfulPlanet applications.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [React Component Integration](#react-component-integration)
3. [Server-Side Integration](#server-side-integration)
4. [Payment Gateway Setup](#payment-gateway-setup)
5. [Styling & Theming](#styling--theming)
6. [Template Customization](#template-customization)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js 20.0.0+
- React 18.3.1+
- Express.js 4.21.2+
- TypeScript 5.9.2+
- Vite 7.1.7+

### Directory Structure

All templates are located in `public/samfox-templates/` organized by category:

```
public/samfox-templates/
├── master/         # Master templates & assets
├── payment/        # Payment gateway templates
├── marketplace/    # Marketplace templates
├── dashboards/     # Dashboard templates
├── infrastructure/ # Core system templates
├── heritage/       # Heritage portal templates
├── components/     # Reusable components
├── sectors/        # Sector-specific templates
└── metadata/       # Documentation & catalog
```

---

## React Component Integration

### 1. Template Loader Component

Create a generic template loader for any HTML template:

```tsx
// client/src/components/samfox/TemplateLoader.tsx
import { useEffect, useRef, useState } from 'react';

interface TemplateLoaderProps {
  category: 'master' | 'payment' | 'marketplace' | 'dashboards' | 'infrastructure' | 'heritage' | 'components' | 'sectors';
  template: string;
  className?: string;
  onLoad?: (html: string) => void;
  onError?: (error: Error) => void;
}

export function TemplateLoader({ 
  category, 
  template, 
  className = '',
  onLoad,
  onError 
}: TemplateLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/samfox-templates/${category}/${template}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load template: ${response.statusText}`);
        }

        const html = await response.text();
        
        if (containerRef.current) {
          containerRef.current.innerHTML = html;
        }

        onLoad?.(html);
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        onError?.(error);
        setLoading(false);
      }
    };

    loadTemplate();
  }, [category, template, onLoad, onError]);

  if (loading) {
    return <div className="animate-pulse">Loading template...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return <div ref={containerRef} className={className} />;
}
```

### 2. Payment Gateway Component

Wrapper for payment templates with PayPal integration:

```tsx
// client/src/components/samfox/PaymentGateway.tsx
import { useState } from 'react';
import { TemplateLoader } from './TemplateLoader';
import { PayPalButton } from '@/components/PayPalButton';

interface PaymentGatewayProps {
  template: string;
  amount: number;
  currency?: string;
  productName?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function PaymentGateway({
  template,
  amount,
  currency = 'USD',
  productName = 'Product',
  onSuccess,
  onError
}: PaymentGatewayProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handlePaymentSuccess = (data: any) => {
    setPaymentStatus('success');
    onSuccess?.(data);
  };

  const handlePaymentError = (error: Error) => {
    setPaymentStatus('error');
    onError?.(error);
  };

  return (
    <div className="payment-gateway-container">
      <TemplateLoader
        category="payment"
        template={template}
        className="payment-template"
      />
      
      <div className="payment-actions mt-6">
        <PayPalButton
          amount={amount}
          currency={currency}
          description={productName}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
        
        {paymentStatus === 'processing' && (
          <p className="text-blue-500 mt-2">Processing payment...</p>
        )}
        {paymentStatus === 'success' && (
          <p className="text-green-500 mt-2">Payment successful!</p>
        )}
        {paymentStatus === 'error' && (
          <p className="text-red-500 mt-2">Payment failed. Please try again.</p>
        )}
      </div>
    </div>
  );
}
```

### 3. Marketplace Frame Component

Renderer for marketplace templates:

```tsx
// client/src/components/samfox/MarketplaceFrame.tsx
import { useEffect, useRef } from 'react';
import { TemplateLoader } from './TemplateLoader';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

interface MarketplaceFrameProps {
  template: string;
  products?: Product[];
  onProductClick?: (product: Product) => void;
}

export function MarketplaceFrame({ 
  template, 
  products = [],
  onProductClick 
}: MarketplaceFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject product data into template after load
    if (frameRef.current && products.length > 0) {
      const productContainer = frameRef.current.querySelector('[data-products]');
      if (productContainer) {
        productContainer.innerHTML = products.map(product => `
          <div class="product-card" data-product-id="${product.id}">
            ${product.image ? `<img src="${product.image}" alt="${product.name}" />` : ''}
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            ${product.description ? `<p class="description">${product.description}</p>` : ''}
            <button class="btn-primary">View Details</button>
          </div>
        `).join('');

        // Add click handlers
        productContainer.querySelectorAll('.product-card').forEach((card, index) => {
          card.addEventListener('click', () => {
            onProductClick?.(products[index]);
          });
        });
      }
    }
  }, [products, onProductClick]);

  return (
    <div ref={frameRef}>
      <TemplateLoader
        category="marketplace"
        template={template}
      />
    </div>
  );
}
```

### 4. Dashboard Frame Component

Renderer for dashboard templates with real-time data:

```tsx
// client/src/components/samfox/DashboardFrame.tsx
import { useEffect, useRef } from 'react';
import { TemplateLoader } from './TemplateLoader';

interface Metric {
  label: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
}

interface DashboardFrameProps {
  template: string;
  metrics?: Metric[];
  refreshInterval?: number;
  onRefresh?: () => void;
}

export function DashboardFrame({ 
  template, 
  metrics = [],
  refreshInterval = 0,
  onRefresh
}: DashboardFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject metrics into template
    if (frameRef.current && metrics.length > 0) {
      const metricsContainer = frameRef.current.querySelector('[data-metrics]');
      if (metricsContainer) {
        metricsContainer.innerHTML = metrics.map(metric => `
          <div class="metric-card">
            <span class="metric-label">${metric.label}</span>
            <span class="metric-value">${metric.value}</span>
            ${metric.trend && metric.change ? `
              <span class="metric-trend trend-${metric.trend}">
                ${metric.trend === 'up' ? '↑' : '↓'} ${Math.abs(metric.change)}%
              </span>
            ` : ''}
          </div>
        `).join('');
      }
    }
  }, [metrics]);

  useEffect(() => {
    // Set up auto-refresh
    if (refreshInterval > 0 && onRefresh) {
      const interval = setInterval(onRefresh, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, onRefresh]);

  return (
    <div ref={frameRef}>
      <TemplateLoader
        category="dashboards"
        template={template}
      />
    </div>
  );
}
```

---

## Server-Side Integration

### 1. PayPal API Integration

Preserve existing `server/paypal.ts` and create additional module:

```typescript
// server/paypal/api.ts
import { Request, Response } from 'express';

/**
 * Generate PayPal access token
 * Integrated from samfox repository
 */
export async function generateAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * Create PayPal order
 * Compatible with payment templates
 */
export async function createOrder(orderData: {
  amount: string;
  currency: string;
  intent: 'CAPTURE' | 'AUTHORIZE';
}): Promise<any> {
  const accessToken = await generateAccessToken();
  
  const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      intent: orderData.intent,
      purchase_units: [{
        amount: {
          currency_code: orderData.currency,
          value: orderData.amount
        }
      }]
    })
  });

  return response.json();
}

/**
 * Capture PayPal payment
 * Complete order transaction
 */
export async function capturePayment(orderId: string): Promise<any> {
  const accessToken = await generateAccessToken();
  
  const response = await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.json();
}
```

### 2. TypeScript Interfaces

```typescript
// server/paypal/types.ts
export interface PayPalOrder {
  id: string;
  status: 'CREATED' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  amount: {
    currency_code: string;
    value: string;
  };
  payer?: {
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  purchase_units: Array<{
    reference_id?: string;
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
}

export interface PayPalPayment {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PENDING';
  order_id: string;
  amount: {
    currency_code: string;
    value: string;
  };
}

export interface PayPalCredentials {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
}
```

### 3. Express Routes

Add routes for serving templates:

```typescript
// server/routes.ts (add to existing routes)
import express from 'express';
import path from 'path';

export function registerSamFoxRoutes(app: express.Application) {
  // Serve SamFox templates
  app.use('/samfox-templates', express.static(
    path.join(process.cwd(), 'public/samfox-templates')
  ));

  // Get template catalog
  app.get('/api/samfox-templates/catalog', async (req, res) => {
    try {
      const catalogPath = path.join(
        process.cwd(), 
        'public/samfox-templates/metadata/template-index.json'
      );
      const catalog = await import(catalogPath);
      res.json(catalog);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load template catalog' });
    }
  });

  // Load specific template
  app.get('/api/samfox-templates/:category/:template', async (req, res) => {
    try {
      const { category, template } = req.params;
      const templatePath = path.join(
        process.cwd(),
        'public/samfox-templates',
        category,
        template
      );
      res.sendFile(templatePath);
    } catch (error) {
      res.status(404).json({ error: 'Template not found' });
    }
  });
}
```

---

## Payment Gateway Setup

### Environment Variables

Add to `.env`:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_ENVIRONMENT=sandbox  # or 'production'
```

### PayPal SDK Configuration

The templates use PayPal JavaScript SDK. Add to your HTML or React app:

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
```

Or in React:

```tsx
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function App() {
  return (
    <PayPalScriptProvider options={{
      clientId: process.env.PAYPAL_CLIENT_ID,
      currency: 'USD'
    }}>
      {/* Your app components */}
    </PayPalScriptProvider>
  );
}
```

---

## Styling & Theming

### Using Master Template Styles

Import master template CSS variables:

```css
/* In your global CSS */
@import url('/samfox-templates/master/foxed_got_mobiles.html');

/* Or extract CSS variables */
:root {
  /* Seedwave Theme */
  --primary-glow: #00e393;
  --dark-bg: #0a0a0d;
  --card-bg-dark: #1c1c21;
  
  /* Banimal Pastels */
  --banimal-soft-peach: #fff0ed;
  --banimal-soft-pink: #f8dcdc;
  --banimal-soft-lavender: #e8e4f3;
  --banimal-soft-mint: #e0f4f1;
}
```

### Theme Switching

```typescript
// Switch between Light/Dark/Hyper modes
function setTheme(theme: 'light' | 'dark' | 'hyper') {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Auto-detect user preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(prefersDark ? 'dark' : 'light');
```

---

## Template Customization

### Modifying Templates

1. **Never edit original templates directly**
2. Create copies for customization
3. Use CSS overrides in your application
4. Inject data via JavaScript/React

### Example: Customize Payment Template

```tsx
function CustomCheckout() {
  const handleTemplateLoad = (html: string) => {
    // Modify template after load
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Customize elements
    const heading = doc.querySelector('h1');
    if (heading) {
      heading.textContent = 'Custom Checkout Page';
    }
    
    // Inject modified HTML
    return doc.body.innerHTML;
  };

  return (
    <TemplateLoader
      category="payment"
      template="global_checkout_form.html"
      onLoad={handleTemplateLoad}
    />
  );
}
```

---

## Best Practices

### Performance

1. **Lazy Load Templates** - Only load when needed
2. **Cache Templates** - Store in memory/localStorage
3. **Compress Assets** - Gzip/Brotli compression
4. **CDN Delivery** - Serve from CDN if possible

### Security

1. **Sanitize User Input** - Always validate/sanitize data injected into templates
2. **CSP Headers** - Configure Content Security Policy
3. **HTTPS Only** - Always use HTTPS for payment pages
4. **PCI Compliance** - Follow PCI-DSS for payment handling

### Accessibility

1. **ARIA Labels** - Ensure all interactive elements have labels
2. **Keyboard Navigation** - Test all templates with keyboard only
3. **Screen Reader** - Verify screen reader compatibility
4. **Color Contrast** - Maintain WCAG AA standards

---

## Troubleshooting

### Template Not Loading

```typescript
// Check if template exists
fetch('/samfox-templates/payment/global_checkout_form.html')
  .then(res => {
    if (!res.ok) {
      console.error('Template not found:', res.status);
    }
  });
```

### PayPal Integration Issues

```typescript
// Verify PayPal credentials
console.log('PayPal Client ID:', process.env.PAYPAL_CLIENT_ID?.substring(0, 10) + '...');

// Check PayPal SDK load
if (window.paypal) {
  console.log('PayPal SDK loaded successfully');
} else {
  console.error('PayPal SDK not loaded');
}
```

### Styling Conflicts

```css
/* Scope template styles to avoid conflicts */
.samfox-template {
  /* Template-specific styles */
  all: revert;  /* Reset all inherited styles */
}

.samfox-template * {
  /* Apply template styles */
}
```

---

## Additional Resources

- **Complete Documentation:** `docs/SAMFOX_INTEGRATION_COMPLETE.md`
- **Template Catalog:** `metadata/template-index.json`
- **Quick Start:** `README.md`
- **License:** `metadata/LICENSE`
- **Ecosystem Docs:** Root `SAMFOX_ECOSYSTEM_COMPLETE.md`

---

**Need Help?**

1. Check existing implementations in `client/src/pages/samfox-creative-studio.tsx`
2. Review PayPal integration in `client/src/components/PayPalButton.tsx`
3. Refer to template catalog for all available templates
4. See master template for complete CSS framework reference

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-01  
**Maintained by:** Fruitful Global Planet Ecosystem
