# 🔒 SamFox Templates Security Advisory

**IMPORTANT:** This document outlines security considerations when using SamFox templates in production.

---

## ⚠️ Critical Security Issues

### 1. Hardcoded API Credentials

Several templates contain **hardcoded API credentials** that were present in the original `heyns1000/samfox` repository. These credentials **MUST NOT** be used in production environments.

#### Affected Files:

**`public/samfox-templates/sectors/template/index_master.html`** (Lines 2096-2118)
- PayPal SDK Client IDs and Button IDs
- Google Maps API Key
- Spotify Access Token
- Gemini AI API Key
- ⚠️ **CRITICAL: Xero Client Secret and Webhook Key** (Highly sensitive!)

**`public/samfox-templates/payment/loop_pay.html`** (Line 338)
- Empty Gemini API key placeholder

**`public/samfox-templates/payment/paypal_sector_pricing_example.html`** (Lines 8-9)
- Hardcoded PayPal client ID in script URL

**`public/samfox-templates/sectors/ritual_culture/index.html`** (Line 93)
- Missing protocol in external URL (security + functionality issue)

---

## 🛡️ Security Best Practices

### DO NOT Use These Templates As-Is in Production

The templates are provided for **reference and development purposes only**. Before deploying to production:

### 1. Remove All Hardcoded Credentials

**Never expose sensitive credentials in client-side code:**

```javascript
// ❌ WRONG - Never do this
window.API_KEYS = {
    XERO_CLIENT_SECRET: "FIaJGmsaCcKR3Z8kWxPnQd04EhYy6_bImPmoitQDP1U6Smaq",
    XERO_WEBHOOK_KEY: "2fd5LQV0TQDI3572Er/sg66zqEbl8mFWRyfX3XkoKFZGRLK2..."
};

// ✅ CORRECT - Use environment variables on server-side
// In server/routes.ts or similar
const XERO_CLIENT_SECRET = process.env.XERO_CLIENT_SECRET;
```

### 2. Use Server-Side API Proxy

**All sensitive API calls should go through your backend:**

```typescript
// ✅ CORRECT Pattern
// Client makes request to YOUR server
fetch('/api/paypal/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount: 99.99 })
});

// Server handles PayPal communication
// server/routes.ts
app.post('/api/paypal/create-order', async (req, res) => {
    const { amount } = req.body;
    // Use server-side credentials from environment variables
    const order = await createOrder({
        amount: amount.toString(),
        currency: 'USD',
        intent: 'CAPTURE'
    });
    res.json(order);
});
```

### 3. Environment Variables

**Store all credentials in environment variables:**

```env
# .env (NEVER commit this file!)
PAYPAL_CLIENT_ID=your_real_client_id
PAYPAL_CLIENT_SECRET=your_real_client_secret
GOOGLE_MAPS_API_KEY=your_real_api_key
GEMINI_API_KEY=your_real_api_key
XERO_CLIENT_ID=your_real_client_id
XERO_CLIENT_SECRET=your_real_client_secret
```

### 4. Restrict API Keys

When possible, restrict API keys by:
- **HTTP Referrer** (for browser-based APIs like Google Maps)
- **IP Address** (for server-based APIs)
- **Allowed APIs** (enable only required services)

---

## 🔧 How to Safely Use SamFox Templates

### Step 1: Copy Template to Your Project

```bash
# Don't use templates directly from public/samfox-templates/
# Copy and customize in your project
cp public/samfox-templates/payment/Fruitful_payment.html src/custom/my-payment-page.html
```

### Step 2: Remove Hardcoded Credentials

```javascript
// Remove or replace this entire block
window.API_KEYS = {
    // ... all hardcoded credentials
};

// Replace with dynamic configuration
window.API_KEYS = {
    // Only include public, non-sensitive keys
    // Even these should be loaded from your server if possible
};
```

### Step 3: Implement Server-Side Proxy

Use the provided React components which properly proxy through the server:

```tsx
import { PaymentGateway } from '@/components/samfox/PaymentGateway';

// This component uses server-side PayPal integration (secure)
<PaymentGateway
  template="Fruitful_payment.html"
  amount={99.99}
  currency="USD"
  onSuccess={handleSuccess}
/>
```

### Step 4: Configure Environment Variables

```bash
# Add to .env
PAYPAL_CLIENT_ID=your_production_client_id
PAYPAL_CLIENT_SECRET=your_production_client_secret

# Add .env to .gitignore
echo ".env" >> .gitignore
```

---

## 📋 Pre-Production Checklist

Before deploying any SamFox template to production:

- [ ] **Remove all hardcoded API credentials**
- [ ] **Move sensitive operations to server-side**
- [ ] **Configure environment variables**
- [ ] **Restrict API keys by referrer/IP**
- [ ] **Test with production credentials in staging**
- [ ] **Review CSP (Content Security Policy) headers**
- [ ] **Enable HTTPS only**
- [ ] **Implement rate limiting**
- [ ] **Add security monitoring**
- [ ] **Regular security audits**

---

## 🚨 Immediate Actions Required

### Critical: Xero Credentials

The `index_master.html` template contains **Xero client secrets** which should **NEVER** be exposed:

```javascript
// Lines 2114-2117 - REMOVE BEFORE PRODUCTION
XERO_CLIENT_SECRET: "FIaJGmsaCcKR3Z8kWxPnQd04EhYy6_bImPmoitQDP1U6Smaq",
XERO_WEBHOOK_KEY: "2fd5LQV0TQDI3572Er/sg66zqEbl8mFWRyfX3XkoKFZGRLK2..."
```

**Actions:**
1. ✅ Do NOT use this template directly
2. ✅ If you need Xero integration, implement server-side OAuth flow
3. ✅ Rotate these credentials if they were ever used
4. ✅ Use environment variables for all Xero credentials

### High: PayPal Credentials

Multiple templates contain PayPal client IDs:

**Actions:**
1. ✅ Use the provided React components (`PaymentGateway.tsx`) which properly proxy through server
2. ✅ Configure PayPal credentials in `.env` file
3. ✅ Never expose `PAYPAL_CLIENT_SECRET` in client-side code
4. ✅ Client IDs can be public, but still prefer loading dynamically

### Medium: API Keys

Templates contain various API keys:

**Actions:**
1. ✅ Replace all API keys with your own
2. ✅ Restrict API keys by HTTP referrer or IP
3. ✅ Monitor API usage for abuse
4. ✅ Rotate keys regularly

---

## 📚 Recommended Server-Side Implementation

### Example: Secure Payment Flow

```typescript
// server/routes/payment.ts
import { Router } from 'express';
import { createOrder, capturePayment } from '@/server/paypal/api';

const router = Router();

// Create PayPal order (server-side only)
router.post('/api/payment/create-order', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        
        // Validate input
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        
        // Create order with server-side credentials
        const order = await createOrder({
            amount: amount.toString(),
            currency: currency || 'USD',
            intent: 'CAPTURE'
        });
        
        res.json({ orderId: order.id });
    } catch (error) {
        console.error('Order creation failed:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Capture payment (server-side only)
router.post('/api/payment/capture/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Capture payment with server-side credentials
        const result = await capturePayment(orderId);
        
        // Log transaction
        console.log('Payment captured:', result.id);
        
        res.json({ success: true, transactionId: result.id });
    } catch (error) {
        console.error('Payment capture failed:', error);
        res.status(500).json({ error: 'Failed to capture payment' });
    }
});

export default router;
```

### Example: Secure Client-Side Implementation

```tsx
// client/src/components/SecureCheckout.tsx
import { useState } from 'react';

export function SecureCheckout({ amount, onSuccess }) {
    const [loading, setLoading] = useState(false);
    
    const handlePayment = async () => {
        setLoading(true);
        try {
            // Step 1: Create order via YOUR server (secure)
            const response = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'USD' })
            });
            
            const { orderId } = await response.json();
            
            // Step 2: PayPal approval flow (client-side)
            // Use PayPal's JavaScript SDK
            
            // Step 3: Capture payment via YOUR server (secure)
            const captureResponse = await fetch(`/api/payment/capture/${orderId}`, {
                method: 'POST'
            });
            
            const result = await captureResponse.json();
            
            if (result.success) {
                onSuccess(result);
            }
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <button onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
        </button>
    );
}
```

---

## 📞 Support

For security questions or concerns:

1. Review the integration guide: `public/samfox-templates/metadata/INTEGRATION.md`
2. Check existing secure implementations: `client/src/components/PayPalButton.tsx`
3. Refer to server-side PayPal integration: `server/paypal.ts` and `server/paypal/api.ts`

---

## ⚖️ Disclaimer

The SamFox templates are provided "as-is" from the original `heyns1000/samfox` repository. **YOU are responsible for**:

- ✅ Removing all hardcoded credentials
- ✅ Implementing proper security measures
- ✅ Following API provider terms of service
- ✅ Complying with PCI-DSS for payment processing
- ✅ Regular security audits

**The FruitfulPlanet team is not responsible for security breaches resulting from improper use of these templates.**

---

**Status:** ⚠️ Security Advisory Active  
**Last Updated:** 2026-01-01  
**Review Required Before:** Production deployment
