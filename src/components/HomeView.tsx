import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Flame,
  Leaf,
  MessageCircle,
  Share2,
  Plus,
  Gift,
  Phone,
  Snowflake,
  Ban,
  Check,
  Truck,
  Shield,
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    products,
    setSelectedProduct,
    addToCart,
    isFavorite,
    toggleFavorite,
    setIsShareModalOpen,
    orders,
    settings,
  } = useApp();

  const comboProduct = products.find((p) => p.category === 'combos') || products[0];
  const soupProducts = products.filter((p) => p.category === 'sopas');
  const latestOrder = orders[0];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── BENTO GRID HERO & SIGNATURE PRODUCTS (ROW 1) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Bento Tile 1: Hero Banner (Col 1 to 5) */}
        <div className="lg:col-span-5 bg-[#2D4628] rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between text-white overflow-hidden relative shadow-xl min-h-[440px]">
          <div className="relative z-10 space-y-4">
            <div className="bg-white/10 backdrop-blur-md inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#DCE6D5]">
              <Leaf className="w-3.5 h-3.5 text-[#7FB069]" />
              <span>Banner Promocional</span>
            </div>

            <div>
              <h2 className="text-4xl sm:text-5xl font-serif italic leading-[1.05] tracking-tight text-white">
                Sopas Detox<br />100% Naturais
              </h2>
              <p className="text-xs sm:text-sm text-white/70 max-w-[280px] leading-relaxed mt-3 font-normal">
                Sem adição de açúcares ou conservantes. O frescor e a saúde direto no seu freezer.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-3 pt-6">
            <button
              id="hero-order-bento-btn"
              onClick={() => setActiveTab('products')}
              className="w-full py-4 bg-[#7FB069] hover:bg-[#8cc474] text-white rounded-2xl font-bold text-sm tracking-wider uppercase shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              Fazer Meu Pedido
            </button>
            <button
              id="hero-menu-bento-btn"
              onClick={() => setActiveTab('products')}
              className="w-full py-4 bg-white hover:bg-stone-100 text-[#2D4628] rounded-2xl font-bold text-sm tracking-wider uppercase transition-all active:scale-98 cursor-pointer"
            >
              Ver Cardápio
            </button>
          </div>

          {/* Decorative blur glowing orb */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#7FB069]/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Bento Tile 2: Mais Pedidos Showcase (Col 6 to 12) */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-end mb-5">
            <div>
              <span className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest block mb-1">
                Destaques da Semana
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif italic text-[#2D4628]">
                Mais Pedidos
              </h3>
            </div>

            <button
              onClick={() => setActiveTab('products')}
              className="text-[11px] font-bold text-[#7FB069] hover:text-[#2D4628] border-b border-[#7FB069] pb-0.5 tracking-wider uppercase transition-colors"
            >
              Ver Todos
            </button>
          </div>

          {/* Inner 2-column Bento Soup Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {soupProducts.slice(0, 2).map((product) => {
              const fav = isFavorite(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-[#F7F9F6] rounded-3xl p-5 border border-[#E2E8DF] flex flex-col justify-between group hover:border-[#7FB069]/50 transition-all shadow-2xs"
                >
                  <div
                    className="relative w-full aspect-square bg-white rounded-2xl mb-3.5 overflow-hidden shadow-2xs cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${
                          fav ? 'bg-rose-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#2D4628] text-white uppercase tracking-wider">
                        {product.volume}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4
                      onClick={() => setSelectedProduct(product)}
                      className="font-bold text-sm text-[#2D4628] hover:text-[#7FB069] cursor-pointer mb-1 leading-snug"
                    >
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-[#2D4628]/60 line-clamp-1 mb-3">
                      {product.ingredients.slice(0, 3).join(', ')}
                    </p>
                  </div>

                  <div className="mt-auto pt-2 border-t border-[#E2E8DF] flex justify-between items-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#2D4628]/40 block leading-none">
                        Preço
                      </span>
                      <span className="font-bold text-lg text-[#2D4628]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    <button
                      id={`bento-add-product-${product.id}`}
                      onClick={() => addToCart(product, 1)}
                      className="w-9 h-9 bg-white border border-[#E2E8DF] rounded-full flex items-center justify-center font-bold text-[#2D4628] hover:bg-[#7FB069] hover:text-white hover:border-[#7FB069] transition-all shadow-2xs"
                      title="Adicionar ao Carrinho"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── BENTO GRID ROW 2: DELIVERY STATUS & ADMIN & COMBO ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Bento Tile 3: Próxima Entrega / Status (Col 1 to 4) */}
        <div className="md:col-span-4 bg-[#DCE6D5] rounded-[2.5rem] p-6 sm:p-7 flex flex-col justify-between shadow-xs border border-[#7FB069]/20 text-[#2D4628]">
          <div>
            <h4 className="text-[10px] font-black uppercase text-[#2D4628]/50 tracking-widest mb-3">
              Status & Entrega
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#7FB069] animate-pulse"></div>
              <span className="text-sm font-bold text-[#2D4628]">
                {latestOrder ? `Pedido #${latestOrder.orderNumber}: ${latestOrder.status.replace(/_/g, ' ')}` : 'Pronta Entrega em BH'}
              </span>
            </div>
            <p className="text-xs text-[#2D4628]/70 mt-2">
              Entregamos suas sopas 100% congeladas no ponto certo na sua casa ou trabalho.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-[#7FB069]/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-2xs">
                🛵
              </div>
              <div className="text-xs">
                <p className="text-[#2D4628]/60 text-[10px] uppercase font-bold">Entrega Expressa</p>
                <p className="font-bold text-[#2D4628]">Natural Fruit</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('orders')}
              className="px-3 py-1.5 rounded-xl bg-white text-[#2D4628] hover:bg-[#2D4628] hover:text-white text-xs font-bold transition-colors shadow-2xs"
            >
              Ver Pedidos
            </button>
          </div>
        </div>

        {/* Bento Tile 4: Weekly Combo Promo Banner (Col 5 to 12) */}
        <div className="md:col-span-8 bg-linear-to-br from-[#2D4628] via-[#243a20] to-[#1a2c17] rounded-[2.5rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7FB069] text-white text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mais Praticidade na Semana</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif italic text-white leading-tight">
                Combo Para a Semana ♡
              </h3>
              <p className="text-xs text-white/80 max-w-md leading-relaxed">
                7 Sopas Detox + 1 Item Especial Surpresa. Todas as 6 variedades do cardápio + 1 sopa extra e um mimo saudável!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 text-center sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-white/70 block">
                Por Apenas
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#DCE6D5] font-display">
                {formatCurrency(comboProduct.price)}
              </span>
              <span className="text-[10px] text-[#7FB069] font-bold block mt-0.5">
                Economia de R$ 51,00
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
              <Gift className="w-4 h-4 text-[#7FB069]" />
              <span>Inclui 1 Item Especial Surpresa para sua rotina leve</span>
            </div>

            <button
              id="bento-buy-combo-btn"
              onClick={() => addToCart(comboProduct, 1)}
              className="px-6 py-3 bg-[#7FB069] hover:bg-[#8cc474] text-white font-bold rounded-2xl text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Pedir Combo Semanal</span>
            </button>
          </div>

          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#7FB069]/15 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      </div>

      {/* ── BENTO GRID ROW 3: ALL 6 SOUPS CATALOG ── */}
      <div className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-[#E2E8DF]">
          <div>
            <span className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest block mb-1">
              Cardápio Completo
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif italic text-[#2D4628]">
              Nossas 6 Sopas Detox
            </h3>
            <p className="text-xs text-[#2D4628]/60 mt-1">
              Potes individuais de 500ml • 100% Naturais • R$ 35,00 cada
            </p>
          </div>

          <button
            onClick={() => setActiveTab('products')}
            className="text-xs font-bold text-[#7FB069] hover:text-[#2D4628] flex items-center gap-1 transition-colors"
          >
            <span>Ver Modo Detalhado</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Soups Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {soupProducts.map((product) => {
            const fav = isFavorite(product.id);

            return (
              <div
                key={product.id}
                id={`bento-product-card-${product.id}`}
                className="bg-[#F7F9F6] rounded-3xl border border-[#E2E8DF] p-4 flex flex-col justify-between group hover:border-[#7FB069] hover:shadow-sm transition-all"
              >
                <div
                  className="relative h-44 w-full rounded-2xl overflow-hidden mb-3.5 bg-white cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-white/90 backdrop-blur-md text-[#2D4628] uppercase tracking-wider">
                      {product.volume}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
                      fav ? 'bg-rose-500 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-white' : ''}`} />
                  </button>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h4 className="font-bold text-base leading-tight">
                      {product.name}
                    </h4>
                  </div>
                </div>

                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="text-[11px] text-[#2D4628]/70">
                    <span className="font-bold text-[#2D4628]">Ingredientes: </span>
                    {product.ingredients.join(', ')}
                  </div>

                  <div className="pt-3 border-t border-[#E2E8DF] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#2D4628]/40 block leading-none">
                        Preço
                      </span>
                      <span className="font-bold text-lg text-[#2D4628]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-[#2D4628] bg-white border border-[#E2E8DF] hover:bg-[#DCE6D5] transition-colors"
                      >
                        Detalhes
                      </button>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#7FB069] hover:bg-[#8cc474] transition-all active:scale-95 flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pedir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BENTO GRID ROW 4: DASHED 3-PILLAR BRAND BANNER ── */}
      <div className="bg-[#DCE6D5]/30 border border-dashed border-[#7FB069]/40 rounded-[2.5rem] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6 sm:gap-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-bold text-sm text-[#2D4628]">100% Natural</p>
              <p className="text-[10px] text-[#2D4628]/60 uppercase font-semibold">Zero Conservantes</p>
            </div>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-[#7FB069]/20"></div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">🧊</span>
            <div>
              <p className="font-bold text-sm text-[#2D4628]">Congelados</p>
              <p className="text-[10px] text-[#2D4628]/60 uppercase font-semibold">Puro Sabor & Nutrientes</p>
            </div>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-[#7FB069]/20"></div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">🚫</span>
            <div>
              <p className="font-bold text-sm text-[#2D4628]">Sem Açúcar</p>
              <p className="text-[10px] text-[#2D4628]/60 uppercase font-semibold">Saúde Pura</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-end text-center lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-[#7FB069]/20 w-full lg:w-auto">
          <p className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-widest mb-1">
            Indique e Compartilhe
          </p>
          <p className="text-xs font-medium text-[#2D4628] max-w-[220px]">
            Envie o link do app para seus amigos e facilite os pedidos saudáveis!
          </p>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="mt-2.5 px-4 py-1.5 bg-[#7FB069] hover:bg-[#8cc474] text-white text-xs font-bold rounded-xl transition-all shadow-2xs"
          >
            Enviar Link do App
          </button>
        </div>
      </div>
    </div>
  );
};
