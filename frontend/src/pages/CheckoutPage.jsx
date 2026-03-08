import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { ArrowLeft, ShoppingBag, Lock, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'sb'; // 'sb' for sandbox

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const shippingCost = cartTotal >= 100 ? 0 : 9.99;
  const total = cartTotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!shippingInfo[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const createOrder = async () => {
    if (!validateForm()) return;
    
    try {
      const response = await axios.post(`${API_URL}/api/store/orders/create`, {
        items: cartItems.map(item => ({
          slug: item.product.slug,
          quantity: item.quantity,
          price: item.product.price
        })),
        shipping: shippingInfo,
        subtotal: cartTotal,
        shipping_cost: shippingCost,
        total: total
      });
      return response.data.paypal_order_id;
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error('Failed to create order. Please try again.');
      throw error;
    }
  };

  const onApprove = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/store/orders/${data.orderID}/capture`);
      if (response.data.success) {
        clearCart();
        toast.success('Payment successful!');
        navigate('/order-success', { state: { orderId: response.data.order_id } });
      }
    } catch (error) {
      console.error('Failed to capture order:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onError = (err) => {
    console.error('PayPal error:', err);
    toast.error('Payment error. Please try again.');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" data-testid="empty-checkout">
        <ShoppingBag className="w-16 h-16 text-zinc-600 mb-6" />
        <h1 className="font-heading text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-zinc-500 mb-8">Add some products before checking out</p>
        <Link to="/" className="btn-primary" data-testid="back-to-shop-empty">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12" data-testid="checkout-page">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-12"
          data-testid="back-to-shop"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm tracking-[0.1em] uppercase">Continue Shopping</span>
        </Link>

        <h1 className="font-heading text-4xl font-bold tracking-tight mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <div>
            <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-sm">1</span>
              Shipping Information
            </h2>

            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={shippingInfo.email}
                onChange={handleInputChange}
                className="search-input"
                data-testid="email-input"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={shippingInfo.firstName}
                  onChange={handleInputChange}
                  className="search-input"
                  data-testid="first-name-input"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={shippingInfo.lastName}
                  onChange={handleInputChange}
                  className="search-input"
                  data-testid="last-name-input"
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Street address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                className="search-input"
                data-testid="address-input"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="search-input"
                  data-testid="city-input"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  className="search-input"
                  data-testid="state-input"
                />
              </div>
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP code"
                value={shippingInfo.zipCode}
                onChange={handleInputChange}
                className="search-input"
                data-testid="zip-input"
              />
            </div>

            {/* Payment Section */}
            <h2 className="font-heading text-xl font-bold mt-12 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-sm">2</span>
              Payment
            </h2>

            <div className="glass p-6">
              <div className="flex items-center gap-2 text-zinc-400 mb-6">
                <Lock className="w-4 h-4" />
                <span className="text-sm">Secure payment powered by PayPal</span>
              </div>

              <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'black', shape: 'rect', label: 'pay' }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                  disabled={loading}
                  data-testid="paypal-buttons"
                />
              </PayPalScriptProvider>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-center gap-4 text-zinc-500">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Credit & Debit Cards • PayPal Balance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="font-heading text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="glass p-6">
              <ul className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <li key={item.product.slug} className="flex gap-4" data-testid={`order-item-${item.product.slug}`}>
                    <div className="w-16 h-20 bg-zinc-900 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.product.name}</h3>
                      <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-mono text-sm">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-mono">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Shipping</span>
                  <span className="font-mono">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                  <span>Total</span>
                  <span className="font-mono" data-testid="order-total">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {cartTotal < 100 && (
              <p className="text-sm text-zinc-500 mt-4 text-center">
                Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4" />
            <p className="text-zinc-400">Processing payment...</p>
          </div>
        </div>
      )}
    </div>
  );
}
