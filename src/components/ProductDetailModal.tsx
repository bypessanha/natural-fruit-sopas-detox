import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Plus,
  Minus,
  Heart,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  ShoppingBag,
  Leaf,
  Share2,
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { SAMPLE_REVIEWS } from '../data/initialData';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    isFavorite,
    toggleFavorite,
    setIsShareModalOpen,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, observation.trim() || undefined);
    setSelectedProduct(null);
    setQuantity(1);
    setObservation('');
  };

  const productReviews = SAMPLE_REVIEWS.filter(
    (r) => r.productId === selectedProduct.id || selectedProduct.category === 'combos'
  );

  const fav = isFavorite(selectedProduct.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-[#E2E8DF] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header & Product Image */}
        <div className="relative bg-[#2D4628] h-64 sm:h-72 w-full shrink-0 overflow-hidden">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"></div>

          {/* Close & Action Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="px-3.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-[#2D4628] uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#7FB069]" />
              {selectedProduct.volume}
            </span>

            <div className="flex items-center gap-2">
              <button
                id="modal-fav-btn"
                onClick={() => toggleFavorite(selectedProduct.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  fav
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white/90 text-[#2D4628] hover:bg-white'
                }`}
                title="Favoritar"
              >
                <Heart className={`w-4 h-4 ${fav ? 'fill-white' : ''}`} />
              </button>

              <button
                id="modal-share-btn"
                onClick={() => setIsShareModalOpen(true)}
                className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#2D4628] backdrop-blur-md transition-all cursor-pointer"
                title="Compartilhar"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                id="close-product-modal-btn"
                onClick={() => setSelectedProduct(null)}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title overlay in image bottom */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            {selectedProduct.badge && (
              <span className="inline-block mb-1.5 px-3 py-0.5 rounded-full bg-[#7FB069] text-white text-[10px] font-bold uppercase tracking-wider">
                ★ {selectedProduct.badge}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-serif italic leading-tight text-white drop-shadow-sm">
              {selectedProduct.name}
            </h2>
            <p className="text-white/80 text-xs sm:text-sm font-medium mt-0.5">
              {selectedProduct.subtitle}
            </p>
          </div>
        </div>

        {/* Scrollable Details Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-[#2D4628]">
          {/* Price and nutritional banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#F7F9F6] rounded-2xl border border-[#E2E8DF]">
            <div>
              <span className="text-[10px] text-[#2D4628]/50 font-black uppercase tracking-wider block">
                Valor unitário
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#2D4628]">
                  {formatCurrency(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm font-medium text-[#2D4628]/40 line-through">
                    {formatCurrency(selectedProduct.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-[#2D4628]">
              <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl shadow-2xs border border-[#E2E8DF]">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>{selectedProduct.calories} kcal aprox.</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl shadow-2xs border border-[#E2E8DF]">
                <Clock className="w-4 h-4 text-[#7FB069]" />
                <span>{selectedProduct.prepTime}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-widest mb-1.5">
              Sobre a Sopa
            </h4>
            <p className="text-sm text-[#2D4628]/80 leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          {/* Dietary Tags */}
          <div>
            <h4 className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-widest mb-2">
              Características & Selos
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCE6D5] text-[#2D4628]"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Ingredients list */}
          <div>
            <h4 className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#7FB069]" /> Ingredientes Selecionados
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedProduct.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-[#F7F9F6] rounded-xl text-xs font-medium text-[#2D4628] border border-[#E2E8DF]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#7FB069] shrink-0"></span>
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Health benefits */}
          <div>
            <h4 className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Benefícios para Sua Saúde
            </h4>
            <div className="space-y-2">
              {selectedProduct.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#2D4628]/80">
                  <CheckCircle2 className="w-4 h-4 text-[#7FB069] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prep instructions card */}
          <div className="p-4 bg-[#F7F9F6] rounded-2xl border border-[#E2E8DF] text-[#2D4628]">
            <h4 className="text-xs font-bold text-[#2D4628] uppercase tracking-wider flex items-center gap-1.5 mb-1">
              🍲 Modo de Preparo Rápido
            </h4>
            <p className="text-xs text-[#2D4628]/80 leading-relaxed">
              <strong>Mantenha congelado:</strong> No momento do consumo, retire a tampa protetora e aqueça no micro-ondas por 5 minutos (ou transfira para uma panela em fogo médio por cerca de 8 minutos até ferver). Bom apetite!
            </p>
          </div>

          {/* Observations input */}
          <div>
            <label className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-widest block mb-1.5">
              Alguma observação para o preparo ou entrega? (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Sem salpicado de salsinha, entregar após as 18h..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-[#E2E8DF] focus:outline-[#7FB069] bg-[#F7F9F6]"
            />
          </div>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-widest flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Avaliações ({selectedProduct.reviewCount})
              </h4>
              <div className="flex items-center gap-1 text-xs font-bold text-[#2D4628]">
                <span>★ {selectedProduct.rating.toFixed(1)}</span>
                <span className="text-[#2D4628]/40">/ 5.0</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {productReviews.map((rev) => (
                <div key={rev.id} className="p-3.5 bg-[#F7F9F6] rounded-2xl border border-[#E2E8DF] text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#2D4628] flex items-center gap-1">
                      {rev.author}
                      <ShieldCheck className="w-3 h-3 text-[#7FB069]" />
                    </span>
                    <span className="text-[10px] text-[#2D4628]/40">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-500 mb-1 text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p className="text-[#2D4628]/70 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E2E8DF] flex items-center justify-between gap-4 shrink-0 shadow-lg">
          {/* Quantity selector */}
          <div className="flex items-center bg-[#F7F9F6] rounded-2xl p-1 border border-[#E2E8DF]">
            <button
              id="decrease-qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#2D4628] hover:bg-white transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-[#2D4628] text-sm">
              {quantity}
            </span>
            <button
              id="increase-qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#2D4628] hover:bg-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add button */}
          <button
            id="modal-add-to-cart-btn"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#7FB069] hover:bg-[#8cc474] active:scale-98 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Adicionar • {formatCurrency(selectedProduct.price * quantity)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
