import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const isOutOfStock = product.stock <= 0;

  const itemInCart = cart.find((i) => i.product === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="group bg-white rounded-3xl border border-[#E8E3EF] hover:border-[#DFCFF4] hover:shadow-soft transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image Area */}
      <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-[#FAF9FD]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Stock Badge */}
        <div className="absolute top-3.5 left-3.5">
          {isOutOfStock ? (
            <span className="px-3 py-1 text-[11px] font-bold bg-[#E11D48] text-white rounded-full shadow-sm tracking-wide">
              Out of Stock
            </span>
          ) : (
            <span className="px-3 py-1 text-[11px] font-semibold bg-white/90 backdrop-blur-md text-[#171719] border border-[#E8E3EF] rounded-full shadow-sm">
              In Stock ({product.stock})
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleToggleLike}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#6B6870] hover:text-[#E11D48] transition-colors shadow-sm"
          title="Save to wishlist"
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#E11D48] text-[#E11D48]' : ''}`} />
        </button>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#834FD4]">
            {product.brand}
          </span>
          <span className="text-[11px] text-[#6B6870] bg-[#FAF9FD] px-2 py-0.5 rounded-full border border-[#E8E3EF]">
            {product.category}
          </span>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="font-bold text-base text-[#171719] group-hover:text-[#834FD4] transition-colors line-clamp-1"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Star Rating Display */}
        <div className="flex items-center gap-1 mt-2 mb-3">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="text-[11px] text-[#6B6870] font-medium ml-1">5.0 (48)</span>
        </div>

        {/* Price and CTA Button */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-3 border-t border-[#F6F1FB]">
          <div>
            <span className="text-base font-bold text-[#171719]">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : itemInCart
                ? 'bg-[#EDE5F8] text-[#834FD4] hover:bg-[#DFCFF4]'
                : 'bg-[#9B6DE3] hover:bg-[#834FD4] text-white shadow-soft'
            }`}
          >
            {itemInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                In Bag ({itemInCart.quantity})
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
