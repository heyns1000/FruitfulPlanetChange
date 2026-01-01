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

/**
 * PaymentGateway - Wrapper for payment templates with PayPal integration
 * 
 * Loads payment templates from public/samfox-templates/payment/
 * and provides PayPal checkout functionality.
 * 
 * @param template - Payment template filename
 * @param amount - Payment amount
 * @param currency - Currency code (default: USD)
 * @param productName - Product/service name
 * @param onSuccess - Callback on successful payment
 * @param onError - Callback on payment error
 */
export function PaymentGateway({
  template,
  amount,
  currency = 'USD',
  productName = 'Product',
  onSuccess,
  onError
}: PaymentGatewayProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePaymentSuccess = (data: any) => {
    console.log('Payment successful:', data);
    setPaymentStatus('success');
    onSuccess?.(data);
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    setPaymentStatus('error');
    setErrorMessage(error.message);
    onError?.(error);
  };

  const handlePaymentStart = () => {
    setPaymentStatus('processing');
  };

  return (
    <div className="payment-gateway-container">
      {/* Load payment template */}
      <TemplateLoader
        category="payment"
        template={template}
        className="payment-template mb-6"
      />
      
      {/* Payment actions */}
      <div className="payment-actions mt-6 p-6 border border-gray-200 rounded-lg bg-white">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Complete Your Purchase</h3>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Product:</span>
            <span className="font-medium">{productName}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Amount:</span>
            <span className="text-2xl font-bold text-primary">
              {currency} {amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* PayPal Button */}
        <div className="paypal-button-container">
          <PayPalButton
            amount={amount}
            currency={currency}
            description={productName}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
        
        {/* Status Messages */}
        {paymentStatus === 'processing' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>Processing payment...</span>
            </div>
          </div>
        )}
        
        {paymentStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Payment successful! Thank you for your purchase.</span>
            </div>
          </div>
        )}
        
        {paymentStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
            <div className="flex items-start gap-2">
              <svg className="h-5 w-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div>
                <p className="font-medium">Payment failed</p>
                <p className="text-sm mt-1">{errorMessage || 'Please try again or contact support.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Badge */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Secure payment powered by PayPal</span>
      </div>
    </div>
  );
}
