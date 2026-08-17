import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Utensils, ShoppingBag, Clock, User } from 'lucide-react';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cartCount } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'home',
      label: 'Início',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: <Utensils className="w-5 h-5" />,
    },
    {
      id: 'cart',
      label: 'Carrinho',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: cartCount,
    },
    {
      id: 'orders',
      label: 'Pedidos',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8DF] py-2 px-2 shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-[#7FB069] font-bold'
                  : 'text-[#2D4628]/40 hover:text-[#2D4628]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#7FB069] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
