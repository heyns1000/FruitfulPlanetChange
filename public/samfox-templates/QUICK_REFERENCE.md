# 🦊 SamFox Templates - Quick Reference Card

**Source:** `heyns1000/samfox` → `Fruitful-Global-Planet/FruitfulPlanetChange`  
**Status:** ✅ Production Ready (with security review)  
**Location:** `public/samfox-templates/`

---

## 📦 What's Included

| Category | Files | Purpose |
|----------|-------|---------|
| **Master** | 3 | Complete CSS framework, 18+ color palettes, 3 theme modes |
| **Payment** | 6 | PayPal checkout flows, product pages, loop payments |
| **Marketplace** | 4 | Product displays, pricing tables, license management |
| **Dashboards** | 4 | Analytics, metrics, management interfaces |
| **Infrastructure** | 5 | Sector indexes, Omni engines, HotStack integration |
| **Heritage** | 2 | Cultural preservation, South African brands |
| **Components** | 4 | Reusable headers, footers, API interfaces |
| **Sectors** | 3 | Industry-specific templates (housing, ritual, master) |

---

## 🚀 Quick Start (3 Steps)

### 1. Load a Template
```tsx
import { TemplateLoader } from '@/components/samfox';

<TemplateLoader 
  category="payment" 
  template="global_checkout_form.html" 
/>
```

### 2. Add Payment Gateway
```tsx
import { PaymentGateway } from '@/components/samfox';

<PaymentGateway
  template="Fruitful_payment.html"
  amount={99.99}
  onSuccess={handlePayment}
/>
```

### 3. Configure Environment
```env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_secret
```

---

## ⚠️ Security Checklist

Before production deployment:

- [ ] Read `metadata/SECURITY.md` (CRITICAL!)
- [ ] Remove all hardcoded credentials
- [ ] Configure environment variables
- [ ] Implement server-side API proxy
- [ ] Test with production credentials
- [ ] Enable HTTPS only
- [ ] Set up rate limiting

---

## 📚 Documentation Quick Links

| Document | Purpose | Size |
|----------|---------|------|
| `README.md` | Quick start guide | 12KB |
| `INTEGRATION.md` | Detailed integration | 18KB |
| `SECURITY.md` | **Security warnings** ⚠️ | 10KB |
| `SAMFOX_INTEGRATION_COMPLETE.md` | Complete reference | 22KB |
| `template-index.json` | Template catalog | 9KB |

---

## 🛠️ React Components

```tsx
// 1. Generic template loader
import { TemplateLoader } from '@/components/samfox';

// 2. Payment gateway wrapper
import { PaymentGateway } from '@/components/samfox';

// 3. Marketplace renderer
import { MarketplaceFrame } from '@/components/samfox';

// 4. Dashboard with metrics
import { DashboardFrame } from '@/components/samfox';
```

---

## 💡 Common Use Cases

### E-Commerce Checkout
```tsx
<PaymentGateway
  template="global_checkout_form.html"
  amount={productPrice}
  currency="USD"
  onSuccess={handleOrderComplete}
/>
```

### Marketplace Landing
```tsx
<MarketplaceFrame
  template="fruitful_innovations.html"
  products={productList}
  onProductClick={viewDetails}
/>
```

### Analytics Dashboard
```tsx
<DashboardFrame
  template="dashboardv3.0.html"
  metrics={realtimeMetrics}
  refreshInterval={30000}
/>
```

---

## 🔑 Server-Side Setup

```typescript
// server/paypal/api.ts
import { createOrder, capturePayment } from '@/server/paypal/api';

// Create order
const order = await createOrder({
  amount: '99.99',
  currency: 'USD',
  intent: 'CAPTURE'
});

// Capture payment
const result = await capturePayment(order.id);
```

---

## ⚡ Build & Test

```bash
# Install dependencies
npm install

# Type check
npm run check

# Lint
npm run lint

# Build
npm run build

# Start dev server
npm run dev
```

---

## 🎨 Theme Customization

```css
/* Override in your CSS */
:root {
  --primary-glow: #00e393;    /* Seedwave green */
  --dark-bg: #0a0a0d;         /* Dark background */
  --card-bg-dark: #1c1c21;    /* Card background */
}

/* Switch themes */
<body data-theme="dark">  /* light, dark, hyper */
```

---

## 📊 Template Categories

| Category | Template Count | Best For |
|----------|---------------|----------|
| Master | 2 + 1 asset | Design system, framework |
| Payment | 6 | Checkout, transactions |
| Marketplace | 4 | Product display, pricing |
| Dashboards | 4 | Analytics, management |
| Infrastructure | 5 | Navigation, systems |
| Heritage | 2 | Cultural content |
| Components | 4 | Reusable UI parts |
| Sectors | 3 | Industry pages |

---

## 🔒 Security Warning

⚠️ **CRITICAL**: Templates contain hardcoded API credentials from original repository:
- Xero client secrets
- PayPal client IDs
- API keys (Google Maps, Gemini, Spotify)

**DO NOT** use templates as-is in production!

**READ:** `metadata/SECURITY.md` before deployment.

---

## 📞 Getting Help

1. **Quick Start:** Read `README.md`
2. **Integration:** Check `INTEGRATION.md`
3. **Security:** Review `SECURITY.md` (CRITICAL!)
4. **Complete Docs:** See `SAMFOX_INTEGRATION_COMPLETE.md`
5. **Examples:** Check `client/src/pages/samfox-creative-studio.tsx`

---

## ✅ Production Checklist

- [ ] Security review completed
- [ ] Credentials removed/replaced
- [ ] Environment variables configured
- [ ] Server-side proxy implemented
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Payment flows tested
- [ ] Mobile responsive verified
- [ ] Accessibility validated

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-01  
**Status:** ✅ Production Ready (with security review)

**Remember:** Always read `SECURITY.md` before production deployment! ⚠️
