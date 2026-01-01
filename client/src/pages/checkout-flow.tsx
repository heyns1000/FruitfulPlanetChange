import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/hooks/use-cart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ShoppingCart,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from 'lucide-react';

/**
 * Unified Checkout Flow
 * 
 * 4-step checkout process:
 * 1. Cart Review
 * 2. Shipping Information
 * 3. Payment Method (PayPal/PayFast)
 * 4. Order Confirmation
 */
export default function CheckoutFlow() {
  const [, setLocation] = useLocation();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [selectedPayment, setSelectedPayment] = useState<'paypal' | 'payfast'>('paypal');

  // Calculate totals
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.15;
  const shipping = 0; // Free shipping
  const total = subtotal + tax + shipping;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && step < 4) {
      toast({
        title: 'Cart is Empty',
        description: 'Please add items to your cart before checking out.',
        variant: 'destructive',
      });
      setLocation('/marketplace/products');
    }
  }, [items, step, setLocation, toast]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!shippingForm.fullName || !shippingForm.email || !shippingForm.address || !shippingForm.city || !shippingForm.zipCode) {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setStep(3);
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);

    try {
      // Create PayPal order
      const response = await fetch('/paypal/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total.toFixed(2),
          currency: 'USD',
          intent: 'CAPTURE',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const data = await response.json();
      
      // Redirect to PayPal
      if (data.links) {
        const approvalUrl = data.links.find((link: any) => link.rel === 'approve')?.href;
        if (approvalUrl) {
          // In production, redirect to PayPal
          // window.location.href = approvalUrl;
          
          // For now, simulate successful payment
          await createOrder(data.id);
        }
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'Failed to process PayPal payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayFastPayment = async () => {
    setIsProcessing(true);

    try {
      // Create PayFast payment
      const response = await fetch('/api/payfast/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total.toFixed(2),
          currency: 'ZAR',
          itemName: 'Marketplace Order',
          itemDescription: `Order with ${items.length} items`,
          email: shippingForm.email,
          firstName: shippingForm.fullName.split(' ')[0],
          lastName: shippingForm.fullName.split(' ').slice(1).join(' '),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create PayFast payment');
      }

      const data = await response.json();
      
      // In production, redirect to PayFast
      // Create form and submit
      // For now, simulate successful payment
      await createOrder(Date.now().toString());
    } catch (error) {
      console.error('PayFast payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'Failed to process PayFast payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const createOrder = async (paymentId: string) => {
    try {
      const response = await fetch('/api/marketplace/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            brandId: item.brandId,
            brandName: item.name,
            quantity: item.quantity,
            price: item.price,
            sectorId: item.sectorId,
            metadata: item.metadata,
          })),
          shippingAddress: shippingForm,
          paymentMethod: selectedPayment,
          paymentId,
          customerEmail: shippingForm.email,
          customerName: shippingForm.fullName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      setOrderId(data.orderId);
      await clearCart();
      setStep(4);

      toast({
        title: '✅ Order Confirmed',
        description: `Your order ${data.orderId} has been successfully placed!`,
      });
    } catch (error) {
      console.error('Order creation error:', error);
      toast({
        title: 'Order Failed',
        description: 'Failed to create order. Please contact support.',
        variant: 'destructive',
      });
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= stepNum
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {stepNum}
          </div>
          {stepNum < 4 && (
            <div
              className={`w-12 h-1 mx-2 ${
                step > stepNum ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-8">Complete your purchase</p>

        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart Review */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Review Your Cart
                  </CardTitle>
                  <CardDescription>
                    {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start pb-4 border-b">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        {item.integration && (
                          <Badge variant="outline" className="mt-1">
                            {item.integration}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">${item.price}/mo</div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setLocation('/marketplace/products')}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Button>
                    <Button onClick={() => setStep(2)}>
                      Continue to Shipping
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping Information */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>Where should we send your order?</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={shippingForm.fullName}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, fullName: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingForm.email}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={shippingForm.address}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, address: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingForm.city}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, city: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          value={shippingForm.state}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, state: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                        <Input
                          id="zipCode"
                          value={shippingForm.zipCode}
                          onChange={(e) =>
                            setShippingForm({ ...shippingForm, zipCode: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          value={shippingForm.country}
                          onValueChange={(value) =>
                            setShippingForm({ ...shippingForm, country: value })
                          }
                        >
                          <SelectTrigger id="country">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">🇺🇸 United States</SelectItem>
                            <SelectItem value="ZA">🇿🇦 South Africa</SelectItem>
                            <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                            <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                            <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                            <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Cart
                      </Button>
                      <Button type="submit">
                        Continue to Payment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs value={selectedPayment} onValueChange={(v) => setSelectedPayment(v as any)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                      <TabsTrigger value="payfast">PayFast (ZAR)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="paypal" className="space-y-4">
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">💳</div>
                        <h3 className="font-semibold mb-2">PayPal Payment</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          You'll be redirected to PayPal to complete your payment securely
                        </p>
                        <Button
                          size="lg"
                          onClick={handlePayPalPayment}
                          disabled={isProcessing}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Pay ${total.toFixed(2)} with PayPal</>
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="payfast" className="space-y-4">
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🇿🇦</div>
                        <h3 className="font-semibold mb-2">PayFast Payment</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          South African payment gateway (ZAR only)
                        </p>
                        <Button
                          size="lg"
                          onClick={handlePayFastPayment}
                          disabled={isProcessing}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Pay R{(total * 18).toFixed(2)} with PayFast</>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Shipping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Order Confirmation */}
            {step === 4 && orderId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    Order Confirmed!
                  </CardTitle>
                  <CardDescription>Thank you for your purchase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold mb-2">Order #{orderId}</h3>
                    <p className="text-muted-foreground mb-6">
                      A confirmation email has been sent to {shippingForm.email}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={() => setLocation('/marketplace/products')}>
                        Continue Shopping
                      </Button>
                      <Button variant="outline" onClick={() => setLocation('/dashboard')}>
                        View Orders
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (15%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
