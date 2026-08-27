import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  MapPin,
  CreditCard,
  Banknote,
  QrCode,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  formatCurrency,
  buildWhatsAppOrderMessage,
  getWhatsAppLink,
} from '../utils/helpers';
import { DeliveryAddress } from '../types';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    user,
    updateUserProfile,
    saveAddress,
    createOrder,
    setActiveTab,
    settings,
    showToast,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'retirada'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_entrega' | 'dinheiro'>('pix');
  const [changeFor, setChangeFor] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);

  // Address state
  const defaultAddr = user.addresses[0] || {
    id: 'temp',
    label: 'Principal',
    street: '',
    number: '',
    neighborhood: '',
    city: 'Belo Horizonte',
    complement: '',
    referencePoint: '',
  };

  const [customerName, setCustomerName] = useState(user.name || '');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '');
  const [street, setStreet] = useState(defaultAddr.street || '');
  const [number, setNumber] = useState(defaultAddr.number || '');
  const [neighborhood, setNeighborhood] = useState(defaultAddr.neighborhood || '');
  const [city, setCity] = useState(defaultAddr.city || 'Belo Horizonte');
  const [complement, setComplement] = useState(defaultAddr.complement || '');
  const [referencePoint, setReferencePoint] = useState(defaultAddr.referencePoint || '');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    if (result.success) {
      setCouponInput('');
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(settings.pixKey);
    setCopiedPix(true);
    showToast('Chave PIX copiada!', 'success');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      showToast('Por favor, informe seu nome completo.', 'error');
      return;
    }
    if (!customerPhone.trim()) {
      showToast('Por favor, informe seu número de WhatsApp.', 'error');
      return;
    }

    if (deliveryType === 'delivery') {
      if (!street.trim() || !number.trim() || !neighborhood.trim()) {
        showToast('Por favor, preencha o endereço completo para entrega.', 'error');
        return;
      }
    }

    const deliveryAddress: DeliveryAddress = {
      id: `addr_${Date.now()}`,
      label: 'Endereço de Entrega',
      street: deliveryType === 'retirada' ? 'Retirada no Local' : street,
      number: deliveryType === 'retirada' ? 'S/N' : number,
      neighborhood: deliveryType === 'retirada' ? 'Loja Natural Fruit' : neighborhood,
      city: deliveryType === 'retirada' ? 'Belo Horizonte' : city,
      complement: deliveryType === 'retirada' ? undefined : complement,
      referencePoint: deliveryType === 'retirada' ? undefined : referencePoint,
    };

    if (deliveryType === 'delivery') {
      saveAddress(deliveryAddress);
    }

    // Persist customer info for seamless future orders
    updateUserProfile({
      name: customerName.trim(),
      phone: customerPhone.trim(),
    });
    const newOrder = createOrder(
  {
    name: customerName.trim(),
    phone: customerPhone.trim(),
    address: deliveryAddress,
    paymentMethod,
    changeFor:
      paymentMethod === 'dinheiro' && changeFor
        ? parseFloat(changeFor)
        : undefined,
  },
  orderNotes.trim() || undefined
);

    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const waText = buildWhatsAppOrderMessage(newOrder, settings);
    const waUrl = getWhatsAppLink(settings.whatsapp1, waText);
    console.log('WHATSAPP TEXTO:', waText);
    console.log('WHATSAPP URL:', waUrl);
    console.log('WHATSAPP NUMERO:', settings.whatsapp1);
    window.open(waUrl, '_blank');
    showToast('Pedido gerado com sucesso! Abrindo WhatsApp...', 'success');
    setActiveTab('orders');
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center border border-[#E2E8DF] shadow-xs space-y-4 max-w-md mx-auto my-8 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#F0F4ED] text-[#2D4628] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 text-[#7FB069]" />
        </div>
        <div>
          <h3 className="text-2xl font-serif italic text-[#2D4628]">Seu carrinho está vazio</h3>
          <p className="text-xs text-[#2D4628]/60 mt-1 leading-relaxed">
            Adicione sopas detox frescas e nutritivas ou nosso combo semanal para fazer seu pedido!
          </p>
        </div>
        <button
          id="cart-go-to-products-btn"
          onClick={() => setActiveTab('products')}
          className="w-full py-4 px-6 rounded-2xl bg-[#7FB069] hover:bg-[#8cc474] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Explorar Cardápio de Sopas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest block mb-1">
            Revisão & Checkout
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif italic text-[#2D4628] flex items-center gap-3">
            <span>Meu Carrinho</span>
            <span className="text-xs font-bold font-sans px-3 py-1 rounded-full bg-[#DCE6D5] text-[#2D4628]">
              {cart.reduce((s, i) => s + i.quantity, 0)} {cart.length === 1 ? 'item' : 'itens'}
            </span>
          </h2>
        </div>

        <button
          id="clear-cart-btn"
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Cart Items list & Coupons */}
        <div className="lg:col-span-2 space-y-5">
          {/* Cart items list Bento card */}
          <div className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest">
              Itens Selecionados
            </h3>

            <div className="divide-y divide-[#E2E8DF]">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  id={`cart-item-${item.product.id}`}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-[#F7F9F6] border border-[#E2E8DF] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#2D4628] leading-tight font-sans">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#2D4628]/60">{item.product.volume}</p>
                      {item.observation && (
                        <p className="text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md mt-1 border border-amber-200">
                          Obs: {item.observation}
                        </p>
                      )}
                      <p className="text-sm font-bold text-[#2D4628] mt-1">
                        {formatCurrency(item.product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#F7F9F6] rounded-xl p-1 border border-[#E2E8DF]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#2D4628] hover:bg-white transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-[#2D4628]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#2D4628] hover:bg-white transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-[#2D4628]/40 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon Code Bento Card */}
          <div className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 sm:p-8 shadow-xs space-y-3">
            <h3 className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#7FB069]" /> Cupom de Desconto
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3.5 bg-[#DCE6D5]/40 rounded-2xl border border-[#7FB069]/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7FB069]"></span>
                  <div>
                    <span className="text-xs font-bold text-[#2D4628] font-mono">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[11px] text-[#2D4628]/80">{appliedCoupon.description}</p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                >
                  Remover
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite seu cupom (ex: BEMVINDO)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl px-4 py-3 text-xs uppercase font-mono tracking-wider focus:outline-[#7FB069]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2D4628] hover:bg-[#20321d] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Aplicar
                </button>
              </form>
            )}

            {/* Quick coupon chips */}
            {!appliedCoupon && coupons.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] text-[#2D4628]/50 font-semibold">Sugestões:</span>
                {coupons.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => applyCoupon(c.code)}
                    className="text-[10px] font-bold px-3 py-1 rounded-xl bg-[#F7F9F6] hover:bg-[#DCE6D5] text-[#2D4628] border border-[#E2E8DF] transition-colors cursor-pointer"
                  >
                    🏷️ {c.code}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Delivery & Address Bento Card */}
          <div className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#7FB069]" /> Dados de Entrega
              </h3>

              {/* Delivery / Retirada toggle */}
              <div className="flex bg-[#F7F9F6] p-1 rounded-2xl border border-[#E2E8DF] text-xs font-bold">
                <button
                  onClick={() => setDeliveryType('delivery')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    deliveryType === 'delivery'
                      ? 'bg-white text-[#2D4628] shadow-2xs'
                      : 'text-[#2D4628]/50 hover:text-[#2D4628]'
                  }`}
                >
                  Receber em Casa
                </button>
                <button
                  onClick={() => setDeliveryType('retirada')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    deliveryType === 'retirada'
                      ? 'bg-white text-[#2D4628] shadow-2xs'
                      : 'text-[#2D4628]/50 hover:text-[#2D4628]'
                  }`}
                >
                  Retirar no Local
                </button>
              </div>
            </div>

            {/* Customer Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mariana Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl px-4 py-3 text-xs focus:outline-[#7FB069]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  placeholder="Ex: (31) 98765-4321"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl px-4 py-3 text-xs focus:outline-[#7FB069]"
                />
              </div>
            </div>

            {/* Address fields */}
            {deliveryType === 'delivery' ? (
              <div className="space-y-3 pt-2 border-t border-[#E2E8DF]">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">
                      Rua / Avenida *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Av. Afonso Pena"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl px-4 py-3 text-xs focus:outline-[#7FB069]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 1500"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl px-4 py-3 text-xs focus:outline-[#7FB069]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Savassi, Centro, Lourdes..."
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl px-4 py-3 text-xs focus:outline-[#7FB069]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      placeholder="Belo Horizonte"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl px-4 py-3 text-xs focus:outline-[#7FB069]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Apto 402, Bloco B"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl px-4 py-3 text-xs focus:outline-[#7FB069]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">
                      Ponto de Referência
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Próximo à pracinha..."
                      value={referencePoint}
                      onChange={(e) => setReferencePoint(e.target.value)}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl px-4 py-3 text-xs focus:outline-[#7FB069]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#DCE6D5]/40 rounded-2xl border border-[#7FB069]/30 text-xs text-[#2D4628]">
                📍 <strong>Local de Retirada:</strong> {settings.address}.<br />
                Horário: {settings.openingHours}. Seu pedido será preparado e separado para você retirar congelado!
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">
                Observações gerais do pedido (opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Tocar interfone, ligar ao chegar..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 text-xs focus:outline-[#7FB069]"
              />
            </div>
          </div>
        </div>

        {/* Right column: Payment Methods & Order Summary */}
        <div className="space-y-5">
          {/* Payment Method Selector Bento Card */}
          <div className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 shadow-xs space-y-4">
            <h3 className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#7FB069]" /> Forma de Pagamento
            </h3>

            <div className="space-y-2">
              {/* PIX Option */}
              <label
                onClick={() => setPaymentMethod('pix')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-[#7FB069] bg-[#DCE6D5]/40 ring-1 ring-[#7FB069]'
                    : 'border-[#E2E8DF] hover:bg-[#F7F9F6]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'pix'}
                  onChange={() => setPaymentMethod('pix')}
                  className="mt-1 text-[#7FB069] focus:ring-[#7FB069]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#2D4628]">PIX Instantâneo</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-[#7FB069] text-white rounded-full uppercase">
                      Mais Rápido
                    </span>
                  </div>
                  <p className="text-[11px] text-[#2D4628]/60 mt-0.5">
                    Pague via QR Code ou Chave PIX direto
                  </p>
                </div>
              </label>

              {/* PIX Details card if selected */}
              {paymentMethod === 'pix' && (
                <div className="p-3.5 bg-[#F7F9F6] rounded-2xl border border-[#E2E8DF] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#2D4628] font-bold">
                    <span>Chave PIX:</span>
                    <span className="font-mono text-xs">{settings.pixKey}</span>
                  </div>
                  <button
                    onClick={handleCopyPix}
                    className="w-full py-2.5 px-3 bg-[#7FB069] hover:bg-[#8cc474] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Chave Copiada!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copiar Chave PIX
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-[#2D4628]/70 text-center">
                    Favorecido: {settings.pixRecipientName}
                  </p>
                </div>
              )}

              {/* Card option */}
              <label
                onClick={() => setPaymentMethod('cartao_entrega')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cartao_entrega'
                    ? 'border-[#7FB069] bg-[#DCE6D5]/40 ring-1 ring-[#7FB069]'
                    : 'border-[#E2E8DF] hover:bg-[#F7F9F6]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cartao_entrega'}
                  onChange={() => setPaymentMethod('cartao_entrega')}
                  className="mt-1 text-[#7FB069] focus:ring-[#7FB069]"
                />
                <div>
                  <span className="font-bold text-xs text-[#2D4628]">
                    Cartão na Entrega (Débito/Crédito)
                  </span>
                  <p className="text-[11px] text-[#2D4628]/60 mt-0.5">
                    O entregador levará a maquininha
                  </p>
                </div>
              </label>

              {/* Cash option */}
              <label
                onClick={() => setPaymentMethod('dinheiro')}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'dinheiro'
                    ? 'border-[#7FB069] bg-[#DCE6D5]/40 ring-1 ring-[#7FB069]'
                    : 'border-[#E2E8DF] hover:bg-[#F7F9F6]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'dinheiro'}
                  onChange={() => setPaymentMethod('dinheiro')}
                  className="mt-1 text-[#7FB069] focus:ring-[#7FB069]"
                />
                <div className="flex-1">
                  <span className="font-bold text-xs text-[#2D4628]">Dinheiro</span>
                  <p className="text-[11px] text-[#2D4628]/60 mt-0.5">
                    Pagamento em espécie na entrega
                  </p>
                </div>
              </label>

              {paymentMethod === 'dinheiro' && (
                <div className="pt-2">
                  <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">
                    Precisa de troco para quanto?
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 100 (Deixe em branco se não precisar)"
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                    className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl px-4 py-2.5 text-xs focus:outline-[#7FB069]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order Financial Summary Bento Card */}
          <div className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 shadow-xs space-y-4">
            <h3 className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest">
              Resumo dos Valores
            </h3>

            <div className="space-y-2.5 text-xs text-[#2D4628]/80">
              <div className="flex justify-between">
                <span>Subtotal dos itens:</span>
                <span className="font-bold text-[#2D4628]">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#7FB069] font-bold">
                  <span>Desconto ({appliedCoupon?.code || 'Promoção'}):</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Taxa de Entrega:</span>
                {deliveryType === 'retirada' ? (
                  <span className="text-[#7FB069] font-bold">Retirada Grátis</span>
                ) : deliveryFee === 0 ? (
                  <span className="text-amber-600 font-bold">A CONFIRMAR</span>
                ) : (
                  <span className="font-bold text-[#2D4628]">{formatCurrency(deliveryFee)}</span>
                )}
              </div>

              <div className="pt-3 border-t border-[#E2E8DF] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#2D4628]">Total a Pagar:</span>
                <span className="text-2xl font-bold text-[#2D4628]">
                 {formatCurrency(subtotal - discount)}
                </span>
              </div>
            </div>

            {/* Main Checkout Button styled with Bento theme */}
            <button
              id="finalize-whatsapp-order-btn"
              onClick={handleCheckout}
              className="w-full py-4 px-6 rounded-2xl bg-[#7FB069] hover:bg-[#8cc474] active:scale-98 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2.5 mt-4 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Finalizar Pedido no WhatsApp</span>
            </button>

            <p className="text-[11px] text-[#2D4628]/40 text-center">
              🔒 Transmissão direta e segura para o atendente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
