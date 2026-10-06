import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const isOutOfStock = product.stock <= 0;

  // Check if item is already in cart
  const itemInCart = cart.find((i) => i.product === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Stock Badge */}
        <div className="absolute top-2.5 left-2.5">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-rose-600 text-white rounded-full shadow-sm">
              Out of Stock
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-emerald-800 border border-emerald-200 rounded-full shadow-sm">
              In Stock ({product.stock})
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute top-2.5 right-2.5">
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-slate-900/70 backdrop-blur-sm text-white rounded-md">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-700">
          {product.brand}
        </span>
        <Link
          to={`/products/${product._id}`}
          className="mt-1 font-semibold text-slate-800 text-sm hover:text-emerald-700 line-clamp-1 transition-colors"
          title={product.name}
        >
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price and CTA */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-slate-100">
          <div>
            <span className="text-base font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : itemInCart
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {itemInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                In Cart ({itemInCart.quantity})
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                {isOutOfStock ? 'Sold Out' : 'Add'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
