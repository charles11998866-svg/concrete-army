import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import { Navbar } from '@/components/store/Navbar';
import { Hero } from '@/components/store/Hero';
import { ProductCard } from '@/components/store/ProductCard';
import { CartSidebar } from '@/components/store/CartSidebar';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const CATEGORIES = ['All', 'Tech', 'Streetwear', 'Footwear', 'Accessories', 'Decor'];

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const catalogRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/store/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" data-testid="store-page">
      <Navbar onSearchClick={() => setShowSearch(true)} />
      <CartSidebar />

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-start justify-center pt-32">
          <div className="w-full max-w-2xl px-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input text-xl py-5 pl-14"
                autoFocus
                data-testid="search-input"
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  if (searchQuery) scrollToCatalog();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white"
                data-testid="close-search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-zinc-500 text-sm mt-4">
              Press Enter or close to search
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <Hero onExploreClick={scrollToCatalog} />

      {/* Product Catalog */}
      <section 
        ref={catalogRef}
        className="py-24 md:py-32 px-6 md:px-12 lg:px-24"
        data-testid="product-catalog"
      >
        <div className="max-w-[1600px] mx-auto">
          {/* Section header */}
          <div className="mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-violet-400 mb-4 font-mono">
              Curated Selection
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
              Trending Now
            </h2>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                data-testid={`category-${category.toLowerCase()}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-zinc-900 shimmer" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-6 md:px-12 lg:px-24" data-testid="footer">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <span className="font-heading text-2xl font-bold tracking-tighter uppercase block mb-4">
                NOIR
              </span>
              <p className="text-zinc-500 text-sm leading-relaxed">
                The future of dropshipping. AI-curated products for the modern lifestyle.
              </p>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-4">Contact</h4>
              <p className="text-white font-semibold mb-2">Charles Stacy</p>
              <p className="text-zinc-400 text-sm">Owner & Founder</p>
              <a 
                href="tel:3526724847" 
                className="text-violet-400 hover:text-violet-300 transition-colors mt-2 block"
                data-testid="owner-phone"
              >
                (352) 672-4847
              </a>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">All Products</span></li>
                <li><span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">Trending</span></li>
                <li><span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">AI Picks</span></li>
                <li><span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">New Arrivals</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-sm">
              © 2026 NOIR. All rights reserved.
            </p>
            <p className="text-zinc-600 text-xs">
              Powered by AI-driven product curation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
