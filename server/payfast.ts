import { Request, Response } from 'express';
import crypto from 'crypto';

/**
 * PayFast Payment Gateway Integration
 * 
 * PayFast is South Africa's leading payment gateway supporting ZAR transactions.
 * This module mirrors the structure of server/paypal.ts for consistency.
 * 
 * Documentation: https://developers.payfast.co.za/
 */

// PayFast credentials from environment
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || '10000100';
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a';
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || '';
const PAYFAST_MODE = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';

// PayFast URLs
const PAYFAST_URL =
  PAYFAST_MODE === 'production'
    ? 'https://www.payfast.co.za/eng/process'
    : 'https://sandbox.payfast.co.za/eng/process';

/**
 * Generate MD5 signature for PayFast payment data
 * Required for payment validation
 */
function generatePayfastSignature(data: Record<string, any>, passphrase: string = ''): string {
  // Create parameter string
  let pfOutput = '';
  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== '') {
      pfOutput += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, '+')}&`;
    }
  }

  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);
  
  // Append passphrase if provided
  if (passphrase) {
    getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
  }

  // Generate MD5 hash
  return crypto.createHash('md5').update(getString).digest('hex');
}

/**
 * Verify PayFast payment data signature
 * Used for validating webhook notifications
 */
function verifyPayfastSignature(
  data: Record<string, any>,
  signature: string,
  passphrase: string = ''
): boolean {
  const calculatedSignature = generatePayfastSignature(data, passphrase);
  return calculatedSignature === signature;
}

/**
 * Create PayFast payment
 * Returns payment URL and data for form submission
 */
export async function createPayfastPayment(req: Request, res: Response) {
  try {
    // Validate HTTP method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const { amount, currency, itemName, itemDescription, customStr1, customStr2, email, firstName, lastName } = req.body;

    // Validate amount
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: 'Invalid amount. Amount must be a positive number.',
      });
    }

    // PayFast only supports ZAR
    if (currency && currency !== 'ZAR') {
      return res.status(400).json({
        error: 'Invalid currency. PayFast only supports ZAR (South African Rand).',
      });
    }

    // Build payment data
    const paymentData: Record<string, any> = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${req.protocol}://${req.get('host')}/payment/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/payment/cancel`,
      notify_url: `${req.protocol}://${req.get('host')}/api/payfast/webhook`,
      name_first: firstName || 'Guest',
      name_last: lastName || 'Customer',
      email_address: email || 'customer@example.com',
      m_payment_id: `ORDER-${Date.now()}`, // Unique payment ID
      amount: parseFloat(amount).toFixed(2),
      item_name: itemName || 'Marketplace Order',
      item_description: itemDescription || 'FruitfulPlanet Marketplace Purchase',
    };

    // Add custom strings if provided (for tracking)
    if (customStr1) paymentData.custom_str1 = customStr1;
    if (customStr2) paymentData.custom_str2 = customStr2;

    // Generate signature
    const signature = generatePayfastSignature(paymentData, PAYFAST_PASSPHRASE);
    paymentData.signature = signature;

    res.json({
      success: true,
      paymentUrl: PAYFAST_URL,
      paymentData,
      merchantId: PAYFAST_MERCHANT_ID,
    });
  } catch (error) {
    console.error('Failed to create PayFast payment:', error);
    res.status(500).json({ error: 'Failed to create PayFast payment.' });
  }
}

/**
 * Handle PayFast ITN (Instant Transaction Notification) webhook
 * Called by PayFast after successful payment
 */
export async function handlePayfastWebhook(req: Request, res: Response) {
  try {
    // Validate HTTP method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const data = req.body;

    // Extract signature from data
    const signature = data.signature;
    delete data.signature;

    // Verify signature
    const isValid = verifyPayfastSignature(data, signature, PAYFAST_PASSPHRASE);

    if (!isValid) {
      console.error('PayFast webhook signature verification failed');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Verify payment status
    const paymentStatus = data.payment_status;
    const paymentId = data.m_payment_id;
    const amount = data.amount_gross;

    console.log('PayFast webhook received:', {
      paymentId,
      status: paymentStatus,
      amount,
    });

    // TODO: Update order status in database based on payment status
    // Payment statuses: COMPLETE, FAILED, PENDING, CANCELLED
    
    if (paymentStatus === 'COMPLETE') {
      // Payment successful
      // Update order status to 'paid' in database
      console.log(`Payment ${paymentId} completed successfully`);
    } else {
      // Payment failed or cancelled
      console.log(`Payment ${paymentId} status: ${paymentStatus}`);
    }

    // Send OK response to PayFast (required)
    res.status(200).send('OK');
  } catch (error) {
    console.error('PayFast webhook error:', error);
    res.status(500).json({ error: 'Failed to process webhook.' });
  }
}

/**
 * Get PayFast configuration for client-side
 * Returns merchant ID and mode (sandbox/production)
 */
export async function getPayfastConfig(req: Request, res: Response) {
  try {
    // Validate HTTP method
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed. Use GET.' });
    }

    res.json({
      merchantId: PAYFAST_MERCHANT_ID,
      mode: PAYFAST_MODE,
      paymentUrl: PAYFAST_URL,
      currency: 'ZAR',
    });
  } catch (error) {
    console.error('PayFast config error:', error);
    res.status(500).json({ error: 'Failed to get PayFast configuration.' });
  }
}
