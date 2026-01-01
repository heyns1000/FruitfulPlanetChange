/**
 * PayPal TypeScript Interfaces
 * 
 * Type definitions for PayPal API objects and responses.
 */

export interface PayPalAmount {
  currency_code: string;
  value: string;
}

export interface PayPalPurchaseUnit {
  reference_id?: string;
  description?: string;
  amount: PayPalAmount;
  payee?: {
    email_address?: string;
    merchant_id?: string;
  };
  shipping?: {
    name?: {
      full_name?: string;
    };
    address?: {
      address_line_1?: string;
      address_line_2?: string;
      admin_area_2?: string;
      admin_area_1?: string;
      postal_code?: string;
      country_code?: string;
    };
  };
}

export interface PayPalPayer {
  email_address?: string;
  payer_id?: string;
  name?: {
    given_name?: string;
    surname?: string;
  };
  phone?: {
    phone_type?: string;
    phone_number?: {
      national_number?: string;
    };
  };
  address?: {
    country_code?: string;
  };
}

export interface PayPalOrder {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  intent: 'CAPTURE' | 'AUTHORIZE';
  payer?: PayPalPayer;
  purchase_units: PayPalPurchaseUnit[];
  create_time?: string;
  update_time?: string;
  links?: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalCapture {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'PENDING' | 'REFUNDED';
  amount: PayPalAmount;
  final_capture?: boolean;
  seller_protection?: {
    status?: string;
    dispute_categories?: string[];
  };
  create_time?: string;
  update_time?: string;
}

export interface PayPalPayment {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PENDING';
  order_id: string;
  amount: PayPalAmount;
  captures?: PayPalCapture[];
  create_time?: string;
  update_time?: string;
}

export interface PayPalAuthorization {
  id: string;
  status: 'CREATED' | 'CAPTURED' | 'DENIED' | 'EXPIRED' | 'PARTIALLY_CAPTURED' | 'VOIDED' | 'PENDING';
  amount: PayPalAmount;
  expiration_time?: string;
  create_time?: string;
  update_time?: string;
}

export interface PayPalCredentials {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
}

export interface PayPalErrorResponse {
  name: string;
  message: string;
  debug_id?: string;
  details?: Array<{
    issue: string;
    description?: string;
  }>;
  links?: Array<{
    href: string;
    rel: string;
    method?: string;
  }>;
}

export interface CreateOrderRequest {
  amount: string;
  currency: string;
  intent: 'CAPTURE' | 'AUTHORIZE';
  description?: string;
  referenceId?: string;
}

export interface CapturePaymentRequest {
  orderId: string;
  note?: string;
}

export interface AuthorizePaymentRequest {
  orderId: string;
}

export interface PayPalWebhookEvent {
  id: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  summary?: string;
  resource: any;
  links?: Array<{
    href: string;
    rel: string;
    method?: string;
  }>;
}

/**
 * Common PayPal event types for webhooks
 */
export enum PayPalEventType {
  PAYMENT_CAPTURE_COMPLETED = 'PAYMENT.CAPTURE.COMPLETED',
  PAYMENT_CAPTURE_DENIED = 'PAYMENT.CAPTURE.DENIED',
  PAYMENT_CAPTURE_PENDING = 'PAYMENT.CAPTURE.PENDING',
  PAYMENT_CAPTURE_REFUNDED = 'PAYMENT.CAPTURE.REFUNDED',
  PAYMENT_CAPTURE_REVERSED = 'PAYMENT.CAPTURE.REVERSED',
  CHECKOUT_ORDER_APPROVED = 'CHECKOUT.ORDER.APPROVED',
  CHECKOUT_ORDER_COMPLETED = 'CHECKOUT.ORDER.COMPLETED',
}
