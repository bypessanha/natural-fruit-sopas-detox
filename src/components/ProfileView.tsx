import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import {
  User,
  MapPin,
  Heart,
  Shield,
  LogOut,
  Plus,
  Trash2,
  Share2,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    saveAddress,
    deleteAddress,
    products,
    addToCart,
    toggleFavorite,
    loginUser,
    logoutUser,
    setActiveTab,
    setIsShareModalOpen,
    showToast,
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [phoneInput, setPhoneInput] = useState(user.phone);
  const [emailInput, setEmailInput] = useState(user.email);

  // Address form state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Casa');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrNumber, setNewAddrNumber] = useState('');
  const [newAddrNeighborhood, setNewAddrNeighborhood] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Belo Horizonte');
  const [newAddrComplement, setNewAddrComplement] = useState('');
  const [newAddrReference, setNewAddrReference] = useState('');

  // Login modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const favoriteProducts = products.filter((p) => user.favoriteProductIds.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: nameInput.trim(),
      phone: phoneInput.trim(),
      email: emailInput.trim(),
    });
    setIsEditingProfile(false);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim() || !newAddrNumber.trim() || !newAddrNeighborhood.trim()) {
      showToast('Preencha os campos obrigatórios de endereço.', 'error');
      return;
    }

    saveAddress({
      label: newAddrLabel,
      street: newAddrStreet.trim(),
      number: newAddrNumber.trim(),
      neighborhood: newAddrNeighborhood.trim(),
      city: newAddrCity.trim(),
      complement: newAddrComplement.trim() || undefined,
      referencePoint: newAddrReference.trim() || undefined,
      isDefault: user.addresses.length === 0,
    });

    setIsAddingAddress(false);
    setNewAddrStreet('');
    setNewAddrNumber('');
    setNewAddrNeighborhood('');
    setNewAddrComplement('');
    setNewAddrReference('');
  };

 const handleQuickLogin = async (
  provider: 'whatsapp' | 'google' | 'email'
) => {
  if (provider === 'google') {
    loginUser(
      'Cliente Google',
      '(31) 99999-8888',
      'cliente.google@gmail.com',
      'google'
    );
    setIsLoginModalOpen(false);
  } else if (provider === 'whatsapp') {
    if (!loginPhone.trim() || !loginName.trim()) {
      showToast(
        'Informe seu nome e WhatsApp para entrar.',
        'error'
      );
      return;
    }

    loginUser(
      loginName.trim(),
      loginPhone.trim(),
      loginEmail.trim() || 'cliente@whatsapp.com',
      'whatsapp'
    );

    setIsLoginModalOpen(false);
  } else {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast(
        'Informe seu e-mail e senha para entrar.',
        'error'
      );
      return;
    }

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

    if (error) {
      console.error('ERRO LOGIN SUPABASE:', error);
      showToast(
        'E-mail ou senha inválido.',
        'error'
      );
      return;
    }

    loginUser(
      loginName.trim() || 'Cliente',
      loginPhone.trim() || '',
      data.user.email || loginEmail.trim(),
      'email'
    );

    setLoginPassword('');
    setIsLoginModalOpen(false);

    showToast(
      'Login realizado com sucesso!',
      'success'
    );
  }
};

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest block mb-1">
            Minha Conta
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif italic text-[#2D4628] flex items-center gap-2">
            <span>Meu Perfil</span>
            <User className="w-6 h-6 text-[#7FB069]" />
          </h2>
          <p className="text-xs text-[#2D4628]/70 mt-0.5">
            Gerencie seus dados pessoais, endereços salvos e preferências
          </p>
        </div>

        <button
          id="profile-share-btn"
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#2D4628] bg-white border border-[#E2E8DF] hover:bg-[#DCE6D5] transition-colors shadow-2xs cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[#7FB069]" />
          <span>Indicar App</span>
        </button>
      </div>

      {/* User Info Bento Card */}
      <div className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2D4628] text-white flex items-center justify-center font-serif text-2xl shadow-xs">
              {user.name.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#2D4628]">{user.name}</h3>
                <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCE6D5] text-[#2D4628] uppercase">
                  {user.authProvider === 'guest' ? 'Cliente' : user.authProvider}
                </span>
              </div>
              <p className="text-xs text-[#2D4628]/60 mt-0.5">{user.phone} • {user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingProfile ? (
              <button
                id="edit-profile-btn"
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 bg-[#F7F9F6] hover:bg-[#DCE6D5] text-[#2D4628] text-xs font-bold rounded-xl border border-[#E2E8DF] transition-colors cursor-pointer"
              >
                Editar Dados
              </button>
            ) : (
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 bg-[#F7F9F6] hover:bg-stone-200 text-[#2D4628]/60 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}

            {user.authProvider === 'guest' ? (
              <button
                id="open-login-btn"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-5 py-2 bg-[#7FB069] hover:bg-[#8cc474] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
              >
                Entrar / Cadastrar
              </button>
            ) : (
              <button
                onClick={logoutUser}
                className="p-2 text-[#2D4628]/40 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Edit profile form */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">Nome Completo</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-xl p-2.5 text-xs focus:outline-[#7FB069]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">WhatsApp</label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-xl p-2.5 text-xs focus:outline-[#7FB069]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">E-mail</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-xl p-2.5 text-xs focus:outline-[#7FB069]"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#7FB069] hover:bg-[#8cc474] text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Saved Addresses Section Bento Card */}
      <div className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#7FB069]" /> Endereços de Entrega
          </h3>

          <button
            id="add-address-btn"
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="flex items-center gap-1 text-xs font-bold text-[#7FB069] hover:text-[#2D4628] hover:bg-[#DCE6D5] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Novo</span>
          </button>
        </div>

        {/* Add Address Form */}
        {isAddingAddress && (
          <form
            onSubmit={handleSaveNewAddress}
            className="p-5 bg-[#F7F9F6] rounded-2xl border border-[#E2E8DF] space-y-3"
          >
            <h4 className="text-xs font-bold text-[#2D4628]">Novo Endereço de Entrega</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">Identificação (ex: Casa, Trabalho)</label>
                <input
                  type="text"
                  value={newAddrLabel}
                  onChange={(e) => setNewAddrLabel(e.target.value)}
                  className="w-full bg-white border border-[#E2E8DF] rounded-xl p-2.5 text-xs focus:outline-[#7FB069]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">Rua / Avenida *</label>
                <input
                  type="text"
                  placeholder="Ex: Av. Afonso Pena"
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  className="w-full bg-white border border-[#E2E8DF] rounded-xl p-2.5 text-xs focus:outline-[#7FB069]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">Número *</label>
                <input
                  type="text"
                  placeholder="1500"
                  value={newAddrNumber}
                  onChange={(e) => setNewAddrNumber(e.target.value)}
                  className="w-full bg-white border border-[#E2E8DF] rounded-xl p-2.5 text-xs focus:outline-[#7FB069]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">Bairro *</label>
                <input
                  type="text"
                  placeholder="Savassi"
                  value={newAddrNeighborhood}
                  onChange={(e) => setNewAddrNeighborhood(e.target.value)}
                  className="w-full bg-white border border-[#E2E8DF] rounded-xl p-2.5 text-xs focus:outline-[#7FB069]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">Cidade</label>
                <input
                  type="text"
                  placeholder="Belo Horizonte"
                  value={newAddrCity}
                  onChange={(e) => setNewAddrCity(e.target.value)}
                  className="w-full bg-white border border-[#E2E8DF] rounded-xl p-2.5 text-xs focus:outline-[#7FB069]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">Complemento</label>
                <input
                  type="text"
                  placeholder="Apto 402"
                  value={newAddrComplement}
                  onChange={(e) => setNewAddrComplement(e.target.value)}
                  className="w-full bg-white border border-[#E2E8DF] rounded-xl p-2.5 text-xs focus:outline-[#7FB069]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">Ponto de Referência</label>
                <input
                  type="text"
                  placeholder="Próximo à pracinha"
                  value={newAddrReference}
                  onChange={(e) => setNewAddrReference(e.target.value)}
                  className="w-full bg-white border border-[#E2E8DF] rounded-xl p-2.5 text-xs focus:outline-[#7FB069]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="px-4 py-2 bg-white border border-[#E2E8DF] text-[#2D4628] text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#7FB069] hover:bg-[#8cc474] text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
              >
                Salvar Endereço
              </button>
            </div>
          </form>
        )}

        {/* Address Cards */}
        {user.addresses.length === 0 ? (
          <p className="text-xs text-[#2D4628]/60 italic">Nenhum endereço salvo ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 bg-[#F7F9F6] rounded-2xl border border-[#E2E8DF] flex justify-between items-start text-xs space-y-1"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#2D4628]">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[9px] bg-[#DCE6D5] text-[#2D4628] font-bold px-2 py-0.5 rounded-full uppercase">
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="text-[#2D4628]/80 font-medium">
                    {addr.street}, nº {addr.number}
                  </p>
                  <p className="text-[#2D4628]/60">
                    {addr.neighborhood} - {addr.city} {addr.complement ? `(${addr.complement})` : ''}
                  </p>
                  {addr.referencePoint && (
                    <p className="text-[11px] text-[#2D4628]/40">Ref: {addr.referencePoint}</p>
                  )}
                </div>

                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="p-1 text-[#2D4628]/40 hover:text-rose-600 cursor-pointer"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorites Section Bento Card */}
      <div className="bg-white rounded-[2.5rem] border border-[#E2E8DF] p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-[10px] font-black uppercase text-[#2D4628]/40 tracking-widest flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Minhas Sopas Favoritas ({favoriteProducts.length})
        </h3>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-[#2D4628]/60">Você ainda não favoritou nenhuma sopa.</p>
            <button
              onClick={() => setActiveTab('products')}
              className="mt-2 text-xs font-bold text-[#7FB069] hover:underline cursor-pointer"
            >
              Explorar Cardápio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favoriteProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 bg-[#F7F9F6] rounded-2xl border border-[#E2E8DF] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[#2D4628] leading-tight">
                      {prod.name}
                    </h4>
                    <span className="text-[11px] font-bold text-[#2D4628]">
                      {formatCurrency(prod.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleFavorite(prod.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                    title="Remover dos favoritos"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="p-2 bg-[#7FB069] hover:bg-[#8cc474] text-white rounded-xl shadow-2xs cursor-pointer"
                    title="Adicionar ao Carrinho"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Panel Access Banner Bento */}
      <div className="bg-[#2D4628] text-white rounded-[2.5rem] p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#DCE6D5]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Área Administrativa da Loja</h4>
            <p className="text-xs text-white/70">
              Gerencie produtos, altere preços, acompanhe faturamento e mude status de pedidos
            </p>
          </div>
        </div>

        <button
          id="access-admin-portal-btn"
          onClick={() => setActiveTab('admin')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#7FB069] hover:bg-[#8cc474] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          Acessar Painel Admin
        </button>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-4 border border-[#E2E8DF]">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#DCE6D5] text-[#2D4628] flex items-center justify-center mx-auto text-xl font-bold">
                🌿
              </div>
              <h3 className="text-2xl font-serif italic text-[#2D4628]">Entrar ou Cadastrar</h3>
              <p className="text-xs text-[#2D4628]/60">
                Acesse seus pedidos e salve seus endereços de entrega
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">Seu Nome</label>
                <input
                  type="text"
                  placeholder="Mariana Silva"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 text-xs focus:outline-[#7FB069]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#2D4628]/80 block mb-1">WhatsApp com DDD</label>
                <input
                  type="tel"
                  placeholder="(31) 9.9189-9312"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full bg-[#F7F9F6] border border-[#E2E8DF] rounded-2xl p-3 text-xs focus:outline-[#7FB069]"
                />
              </div>

              {/* Login Buttons */}
              <button
                onClick={() => handleQuickLogin('whatsapp')}
                className="w-full py-3.5 bg-[#7FB069] hover:bg-[#8cc474] text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Continuar com WhatsApp</span>
              </button>

              <button
                onClick={() => handleQuickLogin('google')}
                className="w-full py-3.5 bg-[#F7F9F6] hover:bg-[#DCE6D5] text-[#2D4628] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-[#E2E8DF] cursor-pointer"
              >
                <span>🌐 Continuar com Google</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-xs text-[#2D4628]/50 hover:text-[#2D4628] font-semibold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
