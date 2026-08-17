import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Plus,
  Heart,
  Sparkles,
  Flame,
  Leaf,
  Info,
  X,
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

type CategoryFilter = 'todas' | 'sopas' | 'combos' | 'proteicas' | 'veganas';

export const ProductsView: React.FC = () => {
  const {
    products,
    setSelectedProduct,
    addToCart,
    isFavorite,
    toggleFavorite,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('todas');
  const [sortBy, setSortBy] = useState<'popular' | 'preco_asc' | 'preco_desc' | 'calorias'>('popular');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (activeCategory === 'sopas' && product.category !== 'sopas') return false;
      if (activeCategory === 'combos' && product.category !== 'combos') return false;
      if (
        activeCategory === 'proteicas' &&
        !product.dietaryTags.some((t) => t.toLowerCase().includes('proteí') || t.toLowerCase().includes('ferro'))
      ) {
        return false;
      }
      if (
        activeCategory === 'veganas' &&
        !product.dietaryTags.some((t) => t.toLowerCase().includes('vegano') || t.toLowerCase().includes('vegetariano'))
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(q);
        const matchesIngredients = product.ingredients.some((i) => i.toLowerCase().includes(q));
        const matchesTags = product.dietaryTags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesSubtitle && !matchesIngredients && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'preco_asc') return a.price - b.price;
      if (sortBy === 'preco_desc') return b.price - a.price;
      if (sortBy === 'calorias') return a.calories - b.calories;
      return b.rating - a.rating;
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest block mb-1">
            Cardápio Oficial
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif italic text-[#2D4628] flex items-center gap-2">
            <span>Sopas Detox Naturais</span>
            <Leaf className="w-6 h-6 text-[#7FB069]" />
          </h2>
          <p className="text-xs text-[#2D4628]/70 mt-1">
            Potes de 500ml individuais • 100% Naturais • Sem conservantes • Sem adição de açúcar
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#2D4628]/60 whitespace-nowrap">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-[#E2E8DF] text-xs font-bold text-[#2D4628] rounded-xl px-3 py-2 focus:outline-[#7FB069] shadow-2xs cursor-pointer"
          >
            <option value="popular">Mais Populares ★</option>
            <option value="preco_asc">Menor Preço</option>
            <option value="preco_desc">Maior Preço</option>
            <option value="calorias">Menos Calorias</option>
          </select>
        </div>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#2D4628]/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="product-search-input"
            type="text"
            placeholder="Buscar por nome ou ingrediente (ex: abóbora, gengibre, couve, frango)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2E8DF] rounded-2xl pl-11 pr-10 py-3.5 text-xs sm:text-sm text-[#2D4628] placeholder:text-[#2D4628]/40 focus:outline-[#7FB069] focus:border-[#7FB069] shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2D4628]/40 hover:text-[#2D4628] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills styled per Bento Theme */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="filter-cat-todas"
            onClick={() => setActiveCategory('todas')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'todas'
                ? 'bg-[#2D4628] text-white shadow-xs'
                : 'bg-white text-[#2D4628]/70 border border-[#E2E8DF] hover:bg-[#DCE6D5]'
            }`}
          >
            Todas as Opções ({products.length})
          </button>
          <button
            id="filter-cat-sopas"
            onClick={() => setActiveCategory('sopas')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'sopas'
                ? 'bg-[#2D4628] text-white shadow-xs'
                : 'bg-white text-[#2D4628]/70 border border-[#E2E8DF] hover:bg-[#DCE6D5]'
            }`}
          >
            Sopas Individuais (500ml)
          </button>
          <button
            id="filter-cat-combos"
            onClick={() => setActiveCategory('combos')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'combos'
                ? 'bg-[#2D4628] text-white shadow-xs'
                : 'bg-white text-[#2D4628]/70 border border-[#E2E8DF] hover:bg-[#DCE6D5]'
            }`}
          >
            ✨ Combo Para a Semana
          </button>
          <button
            id="filter-cat-proteicas"
            onClick={() => setActiveCategory('proteicas')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'proteicas'
                ? 'bg-[#2D4628] text-white shadow-xs'
                : 'bg-white text-[#2D4628]/70 border border-[#E2E8DF] hover:bg-[#DCE6D5]'
            }`}
          >
            🍗 Com Frango & Carne
          </button>
          <button
            id="filter-cat-veganas"
            onClick={() => setActiveCategory('veganas')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'veganas'
                ? 'bg-[#2D4628] text-white shadow-xs'
                : 'bg-white text-[#2D4628]/70 border border-[#E2E8DF] hover:bg-[#DCE6D5]'
            }`}
          >
            🌱 100% Veganas / Fit
          </button>
        </div>
      </div>

      {/* Product List / Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-[#E2E8DF] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F7F9F6] flex items-center justify-center mx-auto text-[#2D4628]/40">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#2D4628] text-base">Nenhum produto encontrado</h3>
          <p className="text-xs text-[#2D4628]/60 max-w-sm mx-auto">
            Tente buscar com outros termos como "abóbora", "milho", "frango" ou limpe os filtros.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('todas');
            }}
            className="px-5 py-2.5 rounded-2xl bg-[#7FB069] text-white text-xs font-bold hover:bg-[#8cc474] transition-colors"
          >
            Ver Todas as Sopas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const fav = isFavorite(product.id);
            const isCombo = product.category === 'combos';

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className={`bg-white rounded-[2.5rem] border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                  isCombo ? 'border-[#7FB069] ring-2 ring-[#7FB069]/30' : 'border-[#E2E8DF]'
                }`}
              >
                <div>
                  {/* Image & Badges */}
                  <div
                    className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#F7F9F6] cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>

                    {/* Top labels */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/90 backdrop-blur-md text-[#2D4628] uppercase tracking-wider shadow-2xs">
                        {product.volume}
                      </span>

                      <button
                        id={`fav-btn-catalog-${product.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${
                          fav
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-black/30 hover:bg-black/50 text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Badge and Title */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      {product.badge && (
                        <span className="inline-block mb-1 px-2.5 py-0.5 rounded-md bg-[#7FB069] text-white text-[10px] font-black uppercase">
                          ★ {product.badge}
                        </span>
                      )}
                      <h3 className="font-bold text-lg leading-tight font-sans">
                        {product.name}
                      </h3>
                      <p className="text-white/80 text-xs mt-0.5 line-clamp-1 font-medium">
                        {product.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-5 space-y-3">
                    {/* Ingredients list */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-wider block">
                        Ingredientes 100% Naturais:
                      </span>
                      <p className="text-xs text-[#2D4628]/70 line-clamp-2 leading-relaxed">
                        {product.ingredients.join(' • ')}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.dietaryTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-lg bg-[#F7F9F6] text-[10px] font-semibold text-[#2D4628]/80 border border-[#E2E8DF]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Calories info */}
                    <div className="flex items-center gap-3 text-[11px] text-[#2D4628]/60 pt-1">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#7FB069]" />
                        {product.calories} kcal
                      </span>
                      <span>•</span>
                      <span className="text-[#2D4628] font-bold">
                        ★ {product.rating.toFixed(1)} ({product.reviewCount} avaliações)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer with Price & Actions */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-[#E2E8DF] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] text-[#2D4628]/40 font-bold uppercase block leading-none">
                        Preço
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xl font-bold text-[#2D4628]">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[#2D4628]/40 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`catalog-detail-btn-${product.id}`}
                        onClick={() => setSelectedProduct(product)}
                        className="p-2.5 rounded-xl text-xs font-bold text-[#2D4628] bg-[#F7F9F6] hover:bg-[#DCE6D5] border border-[#E2E8DF] transition-colors"
                        title="Ver detalhes da sopa"
                      >
                        <Info className="w-4 h-4 text-[#2D4628]" />
                      </button>

                      <button
                        id={`catalog-add-btn-${product.id}`}
                        onClick={() => addToCart(product, 1)}
                        className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#7FB069] hover:bg-[#8cc474] active:scale-95 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
