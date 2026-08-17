import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Share2, Shield, MessageCircle, MapPin } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    setIsShareModalOpen,
    isAdmin,
    user,
    settings,
  } = useApp();

  const defaultAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8DF] shadow-2xs">
      {/* Top micro announcement bar */}
      <div className="bg-[#2D4628] text-white/90 text-[11px] font-medium py-1.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-[#7FB069] animate-pulse"></span>
            <span className="text-white/80">Sopas Detox 100% Naturais • Sem açúcar • Congeladas</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-white/80">
            <a
              href={`https://api.whatsapp.com/send?phone=55${settings.whatsapp2 || settings.whatsapp1}&text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20as%20Sopas%20Detox`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#7FB069] flex items-center gap-1 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#7FB069]" />
              <span>(31) 9.9189-9312</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div
          id="brand-logo-btn"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 bg-[#7FB069] rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
            NF
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-bold text-[#2D4628] leading-tight font-sans">
                Natural Fruit
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded-full bg-[#DCE6D5] text-[#2D4628]">
                Detox
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#2D4628]/60">
              Frutas Congeladas
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav Links styled per Bento Theme */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-bold">
          <button
            id="nav-link-home"
            onClick={() => setActiveTab('home')}
            className={`transition-all ${
              activeTab === 'home'
                ? 'text-[#7FB069] border-b-2 border-[#7FB069] pb-1'
                : 'text-[#2D4628]/40 hover:text-[#2D4628]'
            }`}
          >
            Início
          </button>
          <button
            id="nav-link-products"
            onClick={() => setActiveTab('products')}
            className={`transition-all ${
              activeTab === 'products'
                ? 'text-[#7FB069] border-b-2 border-[#7FB069] pb-1'
                : 'text-[#2D4628]/40 hover:text-[#2D4628]'
            }`}
          >
            Produtos
          </button>
          <button
            id="nav-link-orders"
            onClick={() => setActiveTab('orders')}
            className={`transition-all ${
              activeTab === 'orders'
                ? 'text-[#7FB069] border-b-2 border-[#7FB069] pb-1'
                : 'text-[#2D4628]/40 hover:text-[#2D4628]'
            }`}
          >
            Meus Pedidos
          </button>
          <button
            id="nav-link-profile"
            onClick={() => setActiveTab('profile')}
            className={`transition-all ${
              activeTab === 'profile'
                ? 'text-[#7FB069] border-b-2 border-[#7FB069] pb-1'
                : 'text-[#2D4628]/40 hover:text-[#2D4628]'
            }`}
          >
            Perfil
          </button>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Delivery location address */}
          {defaultAddress && (
            <div
              onClick={() => setActiveTab('profile')}
              className="hidden lg:flex flex-col items-end mr-1 text-right cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-[10px] text-[#2D4628]/50 font-black tracking-wider uppercase">
                ENTREGAR EM
              </span>
              <span className="text-xs font-bold uppercase text-[#2D4628] truncate max-w-[150px]">
                {defaultAddress.street}, {defaultAddress.number}
              </span>
            </div>
          )}

          {/* Share App link button */}
          <button
            id="open-share-btn"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#2D4628] bg-[#F7F9F6] hover:bg-[#DCE6D5] border border-[#E2E8DF] transition-all"
            title="Enviar link do app para clientes"
          >
            <Share2 className="w-3.5 h-3.5 text-[#7FB069]" />
            <span className="hidden sm:inline">Enviar Link</span>
          </button>

          {/* Admin Panel switch */}
          <button
            id="toggle-admin-btn"
            onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-[#2D4628] text-white shadow-2xs'
                : 'bg-[#F7F9F6] text-[#2D4628]/70 hover:text-[#2D4628] border border-[#E2E8DF] hover:bg-[#DCE6D5]'
            }`}
            title="Painel do Administrador"
          >
            <Shield className="w-3.5 h-3.5 text-[#7FB069]" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Cart Icon & Badge per Bento theme */}
          <button
            id="open-cart-btn"
            onClick={() => setActiveTab('cart')}
            className="h-10 w-10 bg-[#F0F4ED] hover:bg-[#DCE6D5] border border-[#E2E8DF] rounded-full flex items-center justify-center relative text-[#2D4628] transition-colors cursor-pointer"
            title="Ver Carrinho"
          >
            <ShoppingBag className="w-4 h-4 text-[#2D4628]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
