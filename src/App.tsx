import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ProductsView } from './components/ProductsView';
import { CartView } from './components/CartView';
import { OrdersView } from './components/OrdersView';
import { ProfileView } from './components/ProfileView';
import { AdminPanel } from './components/AdminPanel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShareModal } from './components/ShareModal';
import { ToastContainer } from './components/ToastContainer';
import { MessageCircle, Heart, Phone, Share2, Shield, Clock } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, settings, setIsShareModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#2D4628] flex flex-col font-sans selection:bg-[#7FB069]/30 selection:text-[#2D4628]">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6 sm:pt-8 pb-16">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'products' && <ProductsView />}
        {activeTab === 'cart' && <CartView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <ShareModal />
      <ToastContainer />

      {/* Floating WhatsApp Speed Dial */}
      <a
        id="floating-whatsapp-btn"
        href={`https://api.whatsapp.com/send?phone=55${settings.whatsapp1}&text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido%20de%20Sopas%20Detox`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 right-5 z-30 flex items-center gap-2 p-4 bg-[#7FB069] hover:bg-[#8cc474] text-white rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all group cursor-pointer"
        title="Falar no WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold uppercase tracking-wider px-0 group-hover:px-1">
          Pedir no WhatsApp
        </span>
      </a>

      {/* Bento Footer */}
      <footer className="bg-[#2D4628] text-white/80 pt-12 pb-24 md:pb-12 text-xs">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#7FB069] flex items-center justify-center text-white font-bold text-sm">
                  NF
                </div>
                <div>
                  <h3 className="font-serif italic text-2xl text-white">
                    Natural Fruit
                  </h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#DCE6D5]">
                    Frutas Congeladas • Sopas Detox
                  </p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed max-w-md mt-2">
                Sopas Detox 100% naturais, ultracongeladas no ponto exato para preservar todos os nutrientes e o sabor fresco. Sem conservantes e sem adição de açúcares.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#7FB069]" />
                  <span>Compartilhar App com Clientes</span>
                </button>
              </div>
            </div>

            {/* Column 2: Atendimento */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-widest text-[10px]">
                Atendimento & WhatsApp
              </h4>
              <div className="space-y-2 text-white/70">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#7FB069]" />
                  <span>(31) 9.9189-9312</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#7FB069]" />
                  <span>{settings.openingHours}</span>
                </p>
              </div>
            </div>

            {/* Column 3: Links */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-widest text-[10px]">
                Navegação
              </h4>
              <ul className="space-y-1.5 text-white/70">
                <li>
                  <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors cursor-pointer">
                    Início
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('products')} className="hover:text-white transition-colors cursor-pointer">
                    Cardápio de Sopas Detox
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('cart')} className="hover:text-white transition-colors cursor-pointer">
                    Meu Carrinho
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('orders')} className="hover:text-white transition-colors cursor-pointer">
                    Acompanhar Pedido
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('admin')} className="hover:text-[#DCE6D5] text-white/50 transition-colors flex items-center gap-1 cursor-pointer">
                    <Shield className="w-3 h-3" />
                    <span>Painel Administrativo</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50">
            <p>© {new Date().getFullYear()} Natural Fruit - Frutas Congeladas & Linha Detox. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1 text-white/70">
              <span>Sabor e saúde para o seu dia a dia</span>
              <Heart className="w-3 h-3 text-[#7FB069] fill-[#7FB069]" />
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
