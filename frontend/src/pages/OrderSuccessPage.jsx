import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen flex items-center justify-center px-6" data-testid="order-success-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </motion.div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="success-title">
          Order Confirmed!
        </h1>

        <p className="text-zinc-400 mb-8">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {orderId && (
          <div className="glass p-4 mb-8">
            <p className="text-xs text-zinc-500 mb-1">Order ID</p>
            <p className="font-mono text-sm" data-testid="order-id">{orderId}</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 text-sm text-zinc-400 mb-12">
          <Package className="w-5 h-5" />
          <span>You'll receive a confirmation email shortly</span>
        </div>

        <Link 
          to="/"
          className="btn-primary inline-flex items-center gap-2"
          data-testid="continue-shopping"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
