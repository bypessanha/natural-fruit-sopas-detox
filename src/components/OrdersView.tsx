import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Package,
  CheckCircle2,
  Truck,
  RotateCcw,
  MessageCircle,
  Calendar,
  MapPin,
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { OrderStatus } from '../types';

export const OrdersView: React.FC = () => {
  const { orders, repeatOrder, setActiveTab, settings } = useApp();
  const [filter, setFilter] = useState<'todos' | 'em_andamento' | 'entregues'>('todos');

  const filteredOrders = orders.filter((order) => {
    if (filter === 'em_andamento') {
      return order.status === 'recebido' || order.status === 'preparando' || order.status === 'saiu_para_entrega';
    }
    if (filter === 'entregues') {
      return order.status === 'entregue';
    }
    return true;
  });

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'recebido':
        return 0;
      case 'preparando':
        return 1;
      case 'saiu_para_entrega':
        return 2;
      case 'entregue':
        return 3;
      default:
        return 0;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'recebido':
        return (
          <span className="px-3.5 py-1 bg-[#DCE6D5] text-[#2D4628] rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7FB069] animate-pulse"></span>
            Recebido
          </span>
        );
      case 'preparando':
        return (
          <span className="px-3.5 py-1 bg-[#DCE6D5] text-[#2D4628] rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2D4628] animate-pulse"></span>
            Preparando Congelados
          </span>
        );
      case 'saiu_para_entrega':
        return (
          <span className="px-3.5 py-1 bg-[#7FB069] text-white rounded-full text-xs font-bold flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-white animate-bounce" />
            Saiu para Entrega
          </span>
        );
      case 'entregue':
        return (
          <span className="px-3.5 py-1 bg-[#2D4628] text-white rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7FB069]" />
            Entregue
          </span>
        );
      case 'cancelado':
        return (
          <span className="px-3.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold flex items-center gap-1.5 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            Pedido Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest block mb-1">
            Histórico & Rastreio
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif italic text-[#2D4628] flex items-center gap-2">
            <span>Meus Pedidos</span>
            <Clock className="w-6 h-6 text-[#7FB069]" />
          </h2>
          <p className="text-xs text-[#2D4628]/70 mt-0.5">
            Acompanhe o status de preparo, entrega e histórico de pedidos anteriores
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#E2E8DF] text-xs font-bold">
          <button
            onClick={() => setFilter('todos')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'todos' ? 'bg-[#2D4628] text-white shadow-2xs' : 'text-[#2D4628]/60 hover:text-[#2D4628]'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setFilter('em_andamento')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'em_andamento' ? 'bg-[#2D4628] text-white shadow-2xs' : 'text-[#2D4628]/60 hover:text-[#2D4628]'
            }`}
          >
            Em Andamento
          </button>
          <button
            onClick={() => setFilter('entregues')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'entregues' ? 'bg-[#2D4628] text-white shadow-2xs' : 'text-[#2D4628]/60 hover:text-[#2D4628]'
            }`}
          >
            Entregues
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-10 text-center border border-[#E2E8DF] shadow-xs space-y-4 max-w-md mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-[#F7F9F6] text-[#2D4628]/40 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-serif italic text-[#2D4628]">Nenhum pedido encontrado</h3>
            <p className="text-xs text-[#2D4628]/60 mt-1">
              Você ainda não possui pedidos nesta categoria. Faça seu primeiro pedido no cardápio!
            </p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="py-3 px-6 rounded-2xl bg-[#7FB069] hover:bg-[#8cc474] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            Ver Cardápio de Sopas
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const stepIdx = getStatusStepIndex(order.status);
            const dateFormatted = new Date(order.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                id={`order-card-${order.id}`}
                className="bg-white rounded-[2.5rem] border border-[#E2E8DF] overflow-hidden shadow-xs space-y-4 p-6 sm:p-8"
              >
                {/* Order Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2E8DF]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#DCE6D5] text-[#2D4628] flex items-center justify-center font-bold text-sm border border-[#7FB069]/30">
                      #{order.orderNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#2D4628]">
                          Pedido #{order.orderNumber}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#2D4628]/50 flex items-center gap-1 mt-0.5 font-medium">
                        <Calendar className="w-3 h-3 text-[#7FB069]" />
                        {dateFormatted}
                      </span>
                    </div>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Tracking Steps Timeline */}
                {order.status === 'cancelado' ? (
                  <div className="py-4 px-4 bg-rose-50 rounded-2xl border border-rose-200 text-center">
                    <p className="text-xs font-bold text-rose-700">
                      Este pedido foi cancelado. Se tiver dúvidas, entre em contato pelo WhatsApp.
                    </p>
                  </div>
                ) : (
                  <div className="py-3 px-2 sm:px-4">
                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      {/* Connecting line */}
                      <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-[#F7F9F6] border-y border-[#E2E8DF] -z-0">
                        <div
                          className="h-full bg-[#7FB069] transition-all duration-500"
                          style={{ width: `${(stepIdx / 3) * 100}%` }}
                        ></div>
                      </div>

                      {/* Step 1: Recebido */}
                      <div className="flex flex-col items-center relative z-10 space-y-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            stepIdx >= 0
                              ? 'bg-[#7FB069] text-white shadow-2xs'
                              : 'bg-[#F7F9F6] border border-[#E2E8DF] text-[#2D4628]/40'
                          }`}
                        >
                          1
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-[#2D4628]">Recebido</span>
                      </div>

                      {/* Step 2: Preparando */}
                      <div className="flex flex-col items-center relative z-10 space-y-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            stepIdx >= 1
                              ? 'bg-[#7FB069] text-white shadow-2xs'
                              : 'bg-[#F7F9F6] border border-[#E2E8DF] text-[#2D4628]/40'
                          }`}
                        >
                          2
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-[#2D4628]">Preparando</span>
                      </div>

                      {/* Step 3: Em Rota */}
                      <div className="flex flex-col items-center relative z-10 space-y-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            stepIdx >= 2
                              ? 'bg-[#7FB069] text-white shadow-2xs'
                              : 'bg-[#F7F9F6] border border-[#E2E8DF] text-[#2D4628]/40'
                          }`}
                        >
                          3
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-[#2D4628]">Em Entrega</span>
                      </div>

                      {/* Step 4: Entregue */}
                      <div className="flex flex-col items-center relative z-10 space-y-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            stepIdx >= 3
                              ? 'bg-[#7FB069] text-white shadow-2xs'
                              : 'bg-[#F7F9F6] border border-[#E2E8DF] text-[#2D4628]/40'
                          }`}
                        >
                          4
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold text-[#2D4628]">Entregue</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items in order */}
                <div className="bg-[#F7F9F6] rounded-2xl p-4 sm:p-5 space-y-2 border border-[#E2E8DF]">
                  <span className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-wider block">
                    Produtos do Pedido:
                  </span>
                  <div className="space-y-1.5 text-xs text-[#2D4628]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-medium">
                          {item.quantity}x {item.product.name} ({item.product.volume})
                        </span>
                        <span className="font-bold text-[#2D4628]">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E2E8DF] flex justify-between items-center text-xs">
                    <span className="font-bold text-[#2D4628]">Total do Pedido:</span>
                    <span className="text-base font-bold text-[#2D4628]">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="flex items-start gap-2 text-xs text-[#2D4628]/70">
                  <MapPin className="w-3.5 h-3.5 text-[#7FB069] shrink-0 mt-0.5" />
                  <span>
                    {order.customer.address.street}, {order.customer.address.number} -{' '}
                    {order.customer.address.neighborhood}, {order.customer.address.city}
                  </span>
                </div>

                {/* Order Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={`https://api.whatsapp.com/send?phone=55${settings.whatsapp1}&text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20meu%20pedido%20%23${order.orderNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-[#7FB069] hover:text-[#2D4628] hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#7FB069]" />
                    <span>Dúvidas? Falar no WhatsApp</span>
                  </a>

                  <button
                    id={`repeat-order-btn-${order.id}`}
                    onClick={() => repeatOrder(order)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#2D4628] hover:bg-[#20321d] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Repetir Pedido</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
