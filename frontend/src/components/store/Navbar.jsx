import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const Navbar = ({ onSearchClick }) => {
  const { cartCount, toggleCart } = useCart();

  return (
    <nav className="navbar" data-testid="navbar">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            data-testid="logo-link"
          >
            <Sparkles className="w-6 h-6 text-violet-500" />
            <span className="font-heading text-2xl font-bold tracking-tighter uppercase">
              NOIR
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link 
              to="/" 
              className="text-sm tracking-[0.15em] uppercase text-zinc-400 hover:text-white transition-colors"
              data-testid="nav-shop"
            >
              Shop
            </Link>
            <span 
              className="text-sm tracking-[0.15em] uppercase text-zinc-400 hover:text-white transition-colors cursor-pointer"
              data-testid="nav-trending"
            >
              Trending
            </span>
            <span 
              className="text-sm tracking-[0.15em] uppercase text-zinc-400 hover:text-white transition-colors cursor-pointer"
              data-testid="nav-ai-picks"
            >
              AI Picks
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button 
              onClick={onSearchClick}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              data-testid="search-button"
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            <button 
              onClick={toggleCart}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
              data-testid="cart-button"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="badge" data-testid="cart-count">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
