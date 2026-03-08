import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link 
        to={`/product/${product.slug}`}
        className="product-card block border border-white/5 bg-zinc-900/50 overflow-hidden group"
        data-testid={`product-card-${product.slug}`}
      >
        {/* Image container */}
        <div className="aspect-[4/5] relative overflow-hidden bg-zinc-900">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* AI Badge */}
          {product.ai_curated && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-violet-500 px-2 py-1">
              <Sparkles className="w-3 h-3" />
              <span className="text-[10px] font-bold tracking-wider uppercase">AI Pick</span>
            </div>
          )}

          {/* Hot Badge */}
          {product.trending && (
            <div className="absolute top-4 right-4 bg-rose-500 px-2 py-1">
              <span className="text-[10px] font-bold tracking-wider uppercase">Trending</span>
            </div>
          )}

          {/* Quick add button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 p-3 bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-500 hover:text-white"
            data-testid={`add-to-cart-${product.slug}`}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Product info */}
        <div className="p-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-2 font-mono">
            {product.category}
          </p>
          <h3 className="font-heading text-lg font-semibold tracking-tight mb-2 group-hover:text-violet-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-lg font-mono">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};
