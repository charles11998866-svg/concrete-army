import React from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartSidebar = () => {
  const { 
    cartItems, 
    cartTotal, 
    cartCount,
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={closeCart}
        data-testid="cart-overlay"
      />

      {/* Sidebar */}
      <aside 
        className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}
        data-testid="cart-sidebar"
        aria-hidden={!isCartOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-heading text-xl font-bold tracking-tight uppercase">
            Your Cart ({cartCount})
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            data-testid="close-cart-button"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 mb-4">Your cart is empty</p>
              <button 
                onClick={closeCart}
                className="btn-secondary text-sm py-2 px-4"
                data-testid="continue-shopping-empty"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li 
                  key={item.product.slug} 
                  className="flex gap-4"
                  data-testid={`cart-item-${item.product.slug}`}
                >
                  {/* Image */}
                  <div className="w-20 h-24 bg-zinc-900 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-mono">
                      {item.product.category}
                    </p>
                    <h3 className="font-semibold truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-zinc-400 font-mono">
                      ${item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                        className="quantity-btn"
                        data-testid={`decrease-qty-${item.product.slug}`}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-mono w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                        className="quantity-btn"
                        data-testid={`increase-qty-${item.product.slug}`}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.product.slug)}
                        className="ml-auto p-2 text-zinc-500 hover:text-rose-500 transition-colors"
                        data-testid={`remove-item-${item.product.slug}`}
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-zinc-400">Subtotal</span>
              <span className="font-heading font-bold font-mono">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Shipping calculated at checkout
            </p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="btn-primary w-full flex items-center justify-center gap-2"
              data-testid="checkout-button"
            >
              Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};
