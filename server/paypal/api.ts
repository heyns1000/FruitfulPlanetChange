/**
 * PayPal API Integration
 * 
 * Additional PayPal functions integrated from samfox repository.
 * These complement the existing server/paypal.ts implementation.
 * 
 * NOTE: The existing server/paypal.ts continues to work and should not be modified.
 * These functions provide alternative/additional PayPal integration patterns.
 */

/**
 * Generate PayPal access token
 * 
 * @returns Access token for PayPal API requests
 */
export async function generateAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in environment variables.');
  }

  // Check for sandbox credentials
  if (clientId === 'sandbox_client_id' || clientSecret === 'sandbox_client_secret') {
    console.warn('Using placeholder PayPal credentials. Configure real credentials for production.');
    throw new Error('PayPal sandbox credentials must be configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const environment = process.env.PAYPAL_ENVIRONMENT === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

  try {
    const response = await fetch(`${environment}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`PayPal authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate PayPal access token:', error);
    throw error;
  }
}

/**
 * Create PayPal order
 * 
 * @param orderData - Order details (amount, currency, intent)
 * @returns PayPal order object with ID and status
 */
export async function createOrder(orderData: {
  amount: string;
  currency: string;
  intent: 'CAPTURE' | 'AUTHORIZE';
  description?: string;
  referenceId?: string;
}): Promise<any> {
  const accessToken = await generateAccessToken();
  const environment = process.env.PAYPAL_ENVIRONMENT === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

  try {
    const response = await fetch(`${environment}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: orderData.intent,
        purchase_units: [{
          reference_id: orderData.referenceId || 'default',
          description: orderData.description || 'Purchase',
          amount: {
            currency_code: orderData.currency,
            value: orderData.amount
          }
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`PayPal order creation failed: ${errorData.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to create PayPal order:', error);
    throw error;
  }
}

/**
 * Capture PayPal payment
 * 
 * Completes the order transaction after buyer approval.
 * 
 * @param orderId - PayPal order ID
 * @returns Payment capture result
 */
export async function capturePayment(orderId: string): Promise<any> {
  const accessToken = await generateAccessToken();
  const environment = process.env.PAYPAL_ENVIRONMENT === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

  try {
    const response = await fetch(
      `${environment}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`PayPal payment capture failed: ${errorData.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to capture PayPal payment:', error);
    throw error;
  }
}

/**
 * Get order details
 * 
 * @param orderId - PayPal order ID
 * @returns Order details
 */
export async function getOrderDetails(orderId: string): Promise<any> {
  const accessToken = await generateAccessToken();
  const environment = process.env.PAYPAL_ENVIRONMENT === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

  try {
    const response = await fetch(
      `${environment}/v2/checkout/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get order details: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to get PayPal order details:', error);
    throw error;
  }
}

/**
 * Authorize payment (for two-step transactions)
 * 
 * @param orderId - PayPal order ID
 * @returns Authorization result
 */
export async function authorizePayment(orderId: string): Promise<any> {
  const accessToken = await generateAccessToken();
  const environment = process.env.PAYPAL_ENVIRONMENT === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

  try {
    const response = await fetch(
      `${environment}/v2/checkout/orders/${orderId}/authorize`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`PayPal authorization failed: ${errorData.message || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to authorize PayPal payment:', error);
    throw error;
  }
}
