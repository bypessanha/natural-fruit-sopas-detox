import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, Share2, MessageCircle, QrCode, Smartphone } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, settings, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen) return null;

  const appUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    showToast('Link do App copiado para a área de transferência!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: settings.storeName,
          text: `Peça suas Sopas Detox 100% naturais e congeladas da Natural Fruit direto pelo App! Acesse o cardápio:`,
          url: appUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const shareText = `Olá! 🍲 Conheça as *Sopas Detox 100% Naturais da Natural Fruit*! Praticidade, saúde e sabor no seu dia a dia. Acesse nosso cardápio e faça seu pedido direto pelo App:\n${appUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  // Quick QR code URL generator using public API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}&color=2D4628`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-[#E2E8DF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2D4628] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-[#DCE6D5]" />
            </div>
            <div>
              <h3 className="font-serif italic text-xl leading-tight">Compartilhar Cardápio</h3>
              <p className="text-xs text-white/70">Envie o link do app para seus clientes</p>
            </div>
          </div>
          <button
            id="close-share-modal-btn"
            onClick={() => setIsShareModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* QR Code section */}
          <div className="flex flex-col items-center justify-center p-5 bg-[#F7F9F6] rounded-[2rem] border border-[#E2E8DF]">
            <div className="bg-white p-3 rounded-2xl shadow-xs border border-[#E2E8DF] mb-3">
              <img
                src={qrCodeUrl}
                alt="QR Code do App Natural Fruit"
                className="w-36 h-36 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs font-bold text-[#2D4628] flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#7FB069]" /> Escaneie com a câmera do celular
            </p>
            <p className="text-[11px] text-[#2D4628]/60 text-center mt-0.5">
              Ideal para imprimir em cartões, sacolas ou embalagens de sopa!
            </p>
          </div>

          {/* Link box */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#2D4628]/40 uppercase tracking-widest block">
              Link Direto do Aplicativo:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 bg-[#F7F9F6] border border-[#E2E8DF] text-[#2D4628] text-xs rounded-2xl px-4 py-3 font-mono focus:outline-none select-all"
              />
              <button
                id="copy-link-btn"
                onClick={handleCopyLink}
                className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-[#2D4628] text-white'
                    : 'bg-[#7FB069] hover:bg-[#8cc474] text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              id="share-whatsapp-btn"
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 px-4 bg-[#7FB069] hover:bg-[#8cc474] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>

            <button
              id="native-share-btn"
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 py-3.5 px-4 bg-[#F7F9F6] hover:bg-[#DCE6D5] text-[#2D4628] rounded-2xl font-bold text-xs transition-colors border border-[#E2E8DF] cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-[#2D4628]" />
              <span>Compartilhar</span>
            </button>
          </div>

          {/* How to Install on Phone Guide */}
          <div className="bg-[#F7F9F6] rounded-2xl p-4 border border-[#E2E8DF] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2D4628]">
              <Smartphone className="w-4 h-4 text-[#7FB069]" />
              <span>Como o cliente instala no celular (Ícone na tela):</span>
            </div>
            <div className="text-[11px] text-[#2D4628]/70 space-y-1 leading-relaxed">
              <p>
                <strong>No iPhone (Safari):</strong> Toque no botão de <em>Compartilhar</em> (quadrado com seta para cima) e selecione <strong>"Adicionar à Tela de Início"</strong>.
              </p>
              <p>
                <strong>No Android (Chrome):</strong> Toque nos <em>3 pontinhos</em> no topo do navegador e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
