import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Sparkles, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CartSidebar } from '@/components/store/CartSidebar';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [aiDescription, setAiDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/store/products/${slug}`);
      setProduct(response.data);
      // Generate AI description
      generateAiDescription(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const generateAiDescription = async (prod) => {
    setAiLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/store/ai/description`, {
        product_name: prod.name,
        category: prod.category,
        price: prod.price
      });
      setAiDescription(response.data.description);
    } catch (error) {
      console.error('Failed to generate AI description:', error);
      setAiDescription(prod.description || 'Premium quality product designed for the modern lifestyle.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart`);
      openCart();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen" data-testid="product-detail-page">
      <CartSidebar />

      {/* Back button */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black to-transparent">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-6">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            data-testid="back-to-shop"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-[0.1em] uppercase">Back to Shop</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="aspect-[4/5] bg-zinc-900 relative overflow-hidden sticky top-24">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-image"
              />
              {product.ai_curated && (
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-violet-500 px-3 py-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-wider uppercase">AI Curated</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="lg:sticky lg:top-24">
              <p className="text-xs tracking-[0.3em] uppercase text-violet-400 mb-4 font-mono">
                {product.category}
              </p>
              
              <h1 
                className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6"
                data-testid="product-name"
              >
                {product.name}
              </h1>

              <p 
                className="text-3xl font-mono mb-8"
                data-testid="product-price"
              >
                ${product.price.toFixed(2)}
              </p>

              {/* AI Description */}
              <div className="ai-description mb-8" data-testid="ai-description">
                {aiLoading ? (
                  <p className="text-zinc-400 ai-typing">Generating AI description...</p>
                ) : (
                  <p className="text-zinc-300 leading-relaxed">{aiDescription}</p>
                )}
              </div>

              {/* Quantity selector */}
              <div className="mb-8">
                <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                    data-testid="decrease-quantity"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-lg w-12 text-center" data-testid="quantity-value">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn"
                    data-testid="increase-quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className="btn-primary w-full flex items-center justify-center gap-3 mb-6"
                data-testid="add-to-cart-detail"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </button>

              {/* Features */}
              <div className="border-t border-white/10 pt-8 space-y-4">
                <div className="flex items-center gap-4 text-zinc-400">
                  <Truck className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm">Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-400">
                  <Shield className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm">Secure checkout with PayPal</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-400">
                  <RefreshCw className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm">30-day return policy</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
