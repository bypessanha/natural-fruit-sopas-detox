import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Plus,
  Edit2,
  Tag,
  Save,
  MessageCircle,
  QrCode,
  Share2,
  Lock,
  Sliders,
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { OrderStatus, Product } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    products,
    updateProduct,
    addProduct,
    toggleProductStock,
    coupons,
    settings,
    updateSettings,
    showToast,
    setIsShareModalOpen,
  } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [adminTab, setAdminTab] = useState<'pedidos' | 'produtos' | 'promocoes' | 'loja'>('pedidos');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todos'>('todos');

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'sopas' | 'combos' | 'especiais'>('sopas');
  const [newProdPrice, setNewProdPrice] = useState('35.00');
  const [newProdVolume, setNewProdVolume] = useState('500ml');
  const [newProdIngredients, setNewProdIngredients] = useState('');
  const [newProdBenefits, setNewProdBenefits] = useState('');
  const [newProdCalories, setNewProdCalories] = useState('150');
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80'
  );

  // Metrics Calculations (excluding cancelled orders)
  const activeOrders = orders.filter((ord) => ord.status !== 'cancelado');
  const totalRevenue = activeOrders.reduce((sum, ord) => sum + ord.total, 0);
  const totalOrdersCount = activeOrders.length;
  const pendingOrders = orders.filter((o) => o.status === 'recebido' || o.status === 'preparando');
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const totalSoupsSold = activeOrders.reduce(
    (sum, ord) => sum + ord.items.reduce((iSum, item) => iSum + item.quantity, 0),
    0
  );

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter === 'todos') return true;
    return ord.status === statusFilter;
  });

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '1234' || pinCode === 'naturalfruit' || pinCode === 'admin2026') {
      setIsAuthenticated(true);
      showToast('Acesso administrativo liberado!', 'success');
      setPinCode('');
    } else {
      showToast('Senha de administrador incorreta.', 'error');
    }
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      showToast('O nome do produto é obrigatório.', 'error');
      return;
    }

    const ingredientsList = newProdIngredients
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const benefitsList = newProdBenefits
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    addProduct({
      name: newProdName.trim(),
      subtitle: newProdSubtitle.trim() || 'Linha Detox Natural Fruit',
      category: newProdCategory,
      price: parseFloat(newProdPrice) || 35.0,
      volume: newProdVolume || '500ml',
      ingredients: ingredientsList.length > 0 ? ingredientsList : ['Ingredientes 100% naturais selecionados'],
      benefits: benefitsList.length > 0 ? benefitsList : ['Ação desintoxicante e nutrição balanceada'],
      description: `Deliciosa sopa detox 100% natural, congelada no ponto certo para manter todos os nutrientes.`,
      prepTime: '5 min (micro-ondas) ou 8 min (panela)',
      calories: parseInt(newProdCalories) || 150,
      image: newProdImage,
      inStock: true,
      rating: 5.0,
      reviewCount: 1,
      dietaryTags: ['100% Natural', 'Sem Açúcar', 'Sem Conservantes'],
      accentColor: '#7FB069',
    });

    setIsCreatingProduct(false);
    setNewProdName('');
    setNewProdSubtitle('');
    setNewProdIngredients('');
    setNewProdBenefits('');
  };

  const handleSendStatusUpdateToClient = (order: typeof orders[0], newStatus: OrderStatus, cancelReason?: string) => {
    updateOrderStatus(order.id, newStatus);

    let statusMsg = '';
    if (newStatus === 'preparando') {
      statusMsg = `Olá ${order.customer.name}! 🍲 Seu pedido #${order.orderNumber} da *Natural Fruit* foi recebido e já está sendo separado e preparado com muito carinho!`;
    } else if (newStatus === 'saiu_para_entrega') {
      statusMsg = `Olá ${order.customer.name}! 🛵💨 Seu pedido #${order.orderNumber} da *Natural Fruit* acabou de sair para entrega no endereço: ${order.customer.address.street}, nº ${order.customer.address.number}.`;
    } else if (newStatus === 'entregue') {
      statusMsg = `Olá ${order.customer.name}! 🎉 Seu pedido #${order.orderNumber} foi entregue! Esperamos que aproveite suas Sopas Detox saudáveis. Bom apetite! ♡`;
    } else if (newStatus === 'cancelado') {
      statusMsg = `Olá ${order.customer.name}! Informamos que seu pedido #${order.orderNumber} da *Natural Fruit* foi cancelado.${cancelReason ? ` Motivo: ${cancelReason}.` : ''} Caso tenha alguma dúvida ou queira reagendar, estamos à disposição!`;
    }

    if (statusMsg) {
      const cleanCustomerPhone = order.customer.phone.replace(/\D/g, '');
      const fullCustomerPhone = cleanCustomerPhone.startsWith('55') ? cleanCustomerPhone : `55${cleanCustomerPhone}`;
      const waUrl = `https://api.whatsapp.com/send?phone=${fullCustomerPhone}&text=${encodeURIComponent(statusMsg)}`;
      window.open(waUrl, '_blank');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-[2.5rem] border border-[#E2E8DF] shadow-xl text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#DCE6D5] text-[#2D4628] flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-serif italic text-[#2D4628]">Acesso ao Painel Admin</h2>
          <p className="text-xs text-[#2D4628]/60 mt-1">
            Digite a senha de administrador da loja para gerenciar pedidos, faturamento e produtos.
          </p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-3">
          <input
            type="password"
            placeholder="Digite a senha de administrador"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 text-center text-sm font-mono tracking-widest focus:outline-[#7FB069]"
          />
          <button
            type="submit"
            className="w-full py-3.5 bg-[#2D4628] hover:bg-[#20321d] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header Bento Box */}
      <div className="bg-[#2D4628] text-white rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#7FB069] text-white flex items-center justify-center font-black">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-serif italic text-white">Painel do Administrador</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-[#DCE6D5] uppercase">
                Online
              </span>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              Gestão da Natural Fruit Linha Sopas Detox • Belo Horizonte
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="admin-share-link-btn"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-3 bg-[#7FB069] hover:bg-[#8cc474] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Enviar Link do App</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors cursor-pointer"
            title="Bloquear Painel"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Financial & Metrics Bento KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#E2E8DF] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#7FB069]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#2D4628]/40">
              Faturamento
            </span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#2D4628]">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-[10px] text-[#7FB069] font-bold">
            {totalOrdersCount} pedidos registrados
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#E2E8DF] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#2D4628]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#2D4628]/40">
              Pendentes
            </span>
            <Clock className="w-4 h-4 text-[#7FB069]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#2D4628]">
            {pendingOrders.length}
          </p>
          <p className="text-[10px] text-[#2D4628]/60">Em preparo ou rota</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#E2E8DF] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#7FB069]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#2D4628]/40">
              Ticket Médio
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#2D4628]">
            {formatCurrency(averageTicket)}
          </p>
          <p className="text-[10px] text-[#2D4628]/60">Média por cliente</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 rounded-[2rem] border border-[#E2E8DF] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#7FB069]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#2D4628]/40">
              Sopas Vendidas
            </span>
            <Package className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#2D4628]">
            {totalSoupsSold} potes
          </p>
          <p className="text-[10px] text-[#7FB069] font-bold">100% Naturais</p>
        </div>
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          id="admin-tab-pedidos"
          onClick={() => setAdminTab('pedidos')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            adminTab === 'pedidos'
              ? 'bg-[#2D4628] text-white shadow-xs'
              : 'bg-white text-[#2D4628]/70 hover:bg-[#DCE6D5] border border-[#E2E8DF]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Gestão de Pedidos ({orders.length})</span>
        </button>

        <button
          id="admin-tab-produtos"
          onClick={() => setAdminTab('produtos')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            adminTab === 'produtos'
              ? 'bg-[#2D4628] text-white shadow-xs'
              : 'bg-white text-[#2D4628]/70 hover:bg-[#DCE6D5] border border-[#E2E8DF]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Cardápio & Preços ({products.length})</span>
        </button>

        <button
          id="admin-tab-promocoes"
          onClick={() => setAdminTab('promocoes')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            adminTab === 'promocoes'
              ? 'bg-[#2D4628] text-white shadow-xs'
              : 'bg-white text-[#2D4628]/70 hover:bg-[#DCE6D5] border border-[#E2E8DF]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Cupons & Ofertas</span>
        </button>

        <button
          id="admin-tab-loja"
          onClick={() => setAdminTab('loja')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            adminTab === 'loja'
              ? 'bg-[#2D4628] text-white shadow-xs'
              : 'bg-white text-[#2D4628]/70 hover:bg-[#DCE6D5] border border-[#E2E8DF]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Configuração & Loja</span>
        </button>
      </div>

      {/* TAB 1: GESTÃO DE PEDIDOS */}
      {adminTab === 'pedidos' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#E2E8DF] text-xs font-bold">
              {(['todos', 'recebido', 'preparando', 'saiu_para_entrega', 'entregue', 'cancelado'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                    statusFilter === st ? 'bg-[#2D4628] text-white shadow-2xs' : 'text-[#2D4628]/60 hover:text-[#2D4628]'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-[#2D4628]/50">
              Exibindo {filteredOrders.length} pedido(s)
            </span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-10 text-center border border-[#E2E8DF] shadow-xs">
              <p className="text-xs text-[#2D4628]/60">Nenhum pedido com este filtro.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  id={`admin-order-row-${ord.id}`}
                  className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 sm:p-7 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8DF]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#2D4628] text-white flex items-center justify-center font-bold text-xs font-mono">
                        #{ord.orderNumber}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#2D4628]">
                          {ord.customer.name}
                        </h4>
                        <p className="text-xs text-[#2D4628]/60">
                          {ord.customer.phone} • {new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#2D4628]">
                        {formatCurrency(ord.total)}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#DCE6D5] text-[#2D4628]">
                        {ord.customer.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Order Items & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-[#F7F9F6] p-4 rounded-2xl border border-[#E2E8DF] space-y-1">
                      <span className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-wider block">
                        Itens do Pedido:
                      </span>
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[#2D4628]">
                          <span>
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="font-bold">{formatCurrency(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                      {ord.notes && (
                        <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl mt-1 border border-amber-200">
                          Obs: {ord.notes}
                        </p>
                      )}
                    </div>

                    <div className="bg-[#F7F9F6] p-4 rounded-2xl border border-[#E2E8DF] space-y-1">
                      <span className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-wider block">
                        Endereço de Entrega:
                      </span>
                      <p className="text-[#2D4628] font-bold">
                        {ord.customer.address.street}, nº {ord.customer.address.number}
                      </p>
                      <p className="text-[#2D4628]/60">
                        Bairro: {ord.customer.address.neighborhood} - {ord.customer.address.city}
                      </p>
                      {ord.customer.address.complement && (
                        <p className="text-[#2D4628]/60">Comp: {ord.customer.address.complement}</p>
                      )}
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2D4628]/60">Mudar Status:</span>
                      <button
                        onClick={() => handleSendStatusUpdateToClient(ord, 'preparando')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          ord.status === 'preparando'
                            ? 'bg-[#2D4628] text-white shadow-2xs'
                            : 'bg-[#F7F9F6] hover:bg-[#DCE6D5] text-[#2D4628] border border-[#E2E8DF]'
                        }`}
                      >
                        🥣 Preparando
                      </button>

                      <button
                        onClick={() => handleSendStatusUpdateToClient(ord, 'saiu_para_entrega')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          ord.status === 'saiu_para_entrega'
                            ? 'bg-[#7FB069] text-white shadow-2xs'
                            : 'bg-[#F7F9F6] hover:bg-[#DCE6D5] text-[#2D4628] border border-[#E2E8DF]'
                        }`}
                      >
                        🛵 Em Rota
                      </button>

                      <button
                        onClick={() => handleSendStatusUpdateToClient(ord, 'entregue')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          ord.status === 'entregue'
                            ? 'bg-[#2D4628] text-white shadow-2xs'
                            : 'bg-[#F7F9F6] hover:bg-[#DCE6D5] text-[#2D4628] border border-[#E2E8DF]'
                        }`}
                      >
                        ✓ Entregue
                      </button>

                      <button
                        onClick={() => {
                          const reason = prompt('Motivo do cancelamento (opcional):', 'Item fora de estoque ou solicitação do cliente');
                          if (reason !== null) {
                            handleSendStatusUpdateToClient(ord, 'cancelado', reason);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          ord.status === 'cancelado'
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        }`}
                      >
                        ✕ Cancelar
                      </button>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=55${ord.customer.phone.replace(/\D/g, '')}&text=Ol%C3%A1%20${encodeURIComponent(ord.customer.name)}!%20Aqui%20%C3%A9%20da%20Natural%20Fruit%20sobre%20o%20seu%20pedido%20%23${ord.orderNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#7FB069] hover:bg-[#8cc474] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp Cliente</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUTOS & ALTERAR PREÇOS */}
      {adminTab === 'produtos' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-serif italic text-[#2D4628]">Cardápio de Sopas & Preços</h3>
              <p className="text-xs text-[#2D4628]/60">
                Altere os preços das sopas, pause itens esgotados ou cadastre novos produtos
              </p>
            </div>

            <button
              id="admin-add-product-btn"
              onClick={() => setIsCreatingProduct(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#7FB069] hover:bg-[#8cc474] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Sopa / Combo</span>
            </button>
          </div>

          {/* Product Items Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className={`bg-white rounded-[2.5rem] border p-5 shadow-xs flex items-center justify-between gap-4 ${
                  !prod.inStock ? 'opacity-60 bg-[#F7F9F6] border-[#E2E8DF]' : 'border-[#E2E8DF]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#E2E8DF] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-[#2D4628] truncate">
                        {prod.name}
                      </h4>
                      {prod.badge && (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#DCE6D5] text-[#2D4628] rounded-full">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#2D4628]/60 truncate">{prod.volume} • {prod.calories} kcal</p>
                    <p className="text-base font-bold text-[#2D4628] mt-0.5">
                      {formatCurrency(prod.price)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProduct(prod)}
                      className="p-2 bg-[#F7F9F6] hover:bg-[#DCE6D5] text-[#2D4628] rounded-xl text-xs font-bold flex items-center gap-1 border border-[#E2E8DF] cursor-pointer"
                      title="Editar Preço e Detalhes"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleProductStock(prod.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        prod.inStock
                          ? 'bg-[#DCE6D5] text-[#2D4628] hover:bg-rose-100 hover:text-rose-800'
                          : 'bg-[#F7F9F6] text-[#2D4628]/40 hover:bg-[#DCE6D5] hover:text-[#2D4628]'
                      }`}
                    >
                      {prod.inStock ? 'Em Estoque' : 'Pausado'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Product Modal Form */}
          {isCreatingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
              <form
                onSubmit={handleCreateProductSubmit}
                className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-4 border border-[#E2E8DF] my-auto"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
                  <h3 className="font-bold text-lg text-[#2D4628]">Cadastrar Nova Sopa / Combo</h3>
                  <button
                    type="button"
                    onClick={() => setIsCreatingProduct(false)}
                    className="text-[#2D4628]/50 hover:text-[#2D4628] font-bold text-xs cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[#2D4628]/80 block mb-1">Nome da Sopa *</label>
                    <input
                      type="text"
                      placeholder="Ex: Creme de Ervilha com Hortelã"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[#2D4628]/80 block mb-1">Preço (R$) *</label>
                      <input
                        type="number"
                        step="0.5"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#2D4628]/80 block mb-1">Volume</label>
                      <input
                        type="text"
                        value={newProdVolume}
                        onChange={(e) => setNewProdVolume(e.target.value)}
                        className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#2D4628]/80 block mb-1">
                      Ingredientes (separados por vírgula)
                    </label>
                    <input
                      type="text"
                      placeholder="Ervilha fresca, Hortelã, Azeite, Cebola..."
                      value={newProdIngredients}
                      onChange={(e) => setNewProdIngredients(e.target.value)}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#2D4628]/80 block mb-1">
                      Benefícios para a Saúde (um por linha)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Rica em proteínas vegetais&#10;Ação refrescante e digestiva"
                      value={newProdBenefits}
                      onChange={(e) => setNewProdBenefits(e.target.value)}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingProduct(false)}
                    className="px-4 py-2 bg-white border border-[#E2E8DF] text-[#2D4628] text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#7FB069] hover:bg-[#8cc474] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-2xs cursor-pointer"
                  >
                    Salvar Produto
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Product Modal Form */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <form
                onSubmit={handleSaveProductEdit}
                className="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-4 border border-[#E2E8DF]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8DF]">
                  <h3 className="font-bold text-lg text-[#2D4628]">
                    Editar: {editingProduct.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="text-[#2D4628]/50 hover:text-[#2D4628] font-bold text-xs cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[#2D4628]/80 block mb-1">Nome do Produto</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[#2D4628]/80 block mb-1">Preço Atual (R$)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069] font-bold text-[#2D4628]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#2D4628]/80 block mb-1">Volume</label>
                      <input
                        type="text"
                        value={editingProduct.volume}
                        onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                        className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#2D4628]/80 block mb-1">Selo / Destaque</label>
                    <input
                      type="text"
                      placeholder="Ex: Mais Pedida, Favorito..."
                      value={editingProduct.badge || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-white border border-[#E2E8DF] text-[#2D4628] text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#7FB069] hover:bg-[#8cc474] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-2xs cursor-pointer"
                  >
                    Salvar Preço
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUPONS & PROMOÇÕES */}
      {adminTab === 'promocoes' && (
        <div className="space-y-5">
          <div>
            <h3 className="text-2xl font-serif italic text-[#2D4628]">Cupons de Desconto & Ofertas</h3>
            <p className="text-xs text-[#2D4628]/60">
              Crie cupons para enviar no WhatsApp e atrair novos clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 shadow-xs space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#2D4628] bg-[#DCE6D5] px-3 py-1 rounded-xl">
                    {c.code}
                  </span>
                  <span className="text-[10px] font-bold text-[#7FB069] bg-[#DCE6D5]/50 px-2.5 py-0.5 rounded-full uppercase">
                    {c.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-xs text-[#2D4628]/80 font-medium">{c.description}</p>
                {c.minOrderValue && (
                  <p className="text-[11px] text-[#2D4628]/50">
                    Pedido mínimo: {formatCurrency(c.minOrderValue)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DADOS DA LOJA & WHATSAPP */}
      {adminTab === 'loja' && (
        <div className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 sm:p-8 shadow-xs space-y-5 max-w-2xl">
          <div>
            <h3 className="text-2xl font-serif italic text-[#2D4628]">Configurações da Loja</h3>
            <p className="text-xs text-[#2D4628]/60">
              Configure telefones de WhatsApp, Chave PIX e Taxas de Entrega
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#2D4628]/80 block mb-1">WhatsApp Principal (com DDD)</label>
                <input
                  type="text"
                  value={settings.whatsapp1}
                  onChange={(e) => updateSettings({ whatsapp1: e.target.value })}
                  className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069] font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D4628]/80 block mb-1">WhatsApp Secundário (com DDD)</label>
                <input
                  type="text"
                  value={settings.whatsapp2}
                  onChange={(e) => updateSettings({ whatsapp2: e.target.value })}
                  className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#2D4628]/80 block mb-1">Chave PIX da Loja</label>
                <input
                  type="text"
                  value={settings.pixKey}
                  onChange={(e) => updateSettings({ pixKey: e.target.value })}
                  className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069] font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D4628]/80 block mb-1">Nome do Titular do PIX</label>
                <input
                  type="text"
                  value={settings.pixRecipientName}
                  onChange={(e) => updateSettings({ pixRecipientName: e.target.value })}
                  className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#2D4628]/80 block mb-1">Taxa de Entrega Padrão (R$)</label>
                <input
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) => updateSettings({ deliveryFee: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D4628]/80 block mb-1">Frete Grátis Acima de (R$)</label>
                <input
                  type="number"
                  value={settings.freeDeliveryAbove}
                  onChange={(e) => updateSettings({ freeDeliveryAbove: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 focus:outline-[#7FB069]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
