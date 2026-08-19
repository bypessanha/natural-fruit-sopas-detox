import { CartItem, DeliveryAddress, Order, StoreSettings } from '../types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppOrderMessage(
  order: Order,
  settings: StoreSettings
): string {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `*${idx + 1}. ${item.product.name}* (Qtd: ${item.quantity})\n   ↳ Valor: ${formatCurrency(item.product.price * item.quantity)}${
          item.observation ? `\n   ↳ Obs: _${item.observation}_` : ''
        }`
    )
    .join('\n\n');

  const paymentNames: Record<string, string> = {
    pix: 'PIX (Chave WhatsApp / QR Code)',
    cartao_entrega: 'Cartão de Crédito/Débito na Entrega',
    dinheiro: `Dinheiro ${
      order.customer.changeFor
        ? `(Troco para ${formatCurrency(order.customer.changeFor)})`
        : '(Sem necessidade de troco)'
    }`,
  };

  const addr = order.customer.address;

  // Detecta se o pedido é para retirada no local.
  const isPickup =
    addr.street?.toLowerCase().includes('retirada no local') ||
    addr.neighborhood?.toLowerCase().includes('loja natural fruit');

  const addressText = isPickup
    ? 'Retirada no Local — Loja Natural Fruit'
    : `${addr.street}, nº ${addr.number} - Bairro ${addr.neighborhood}, ${addr.city}${
        addr.complement ? ` (${addr.complement})` : ''
      }${addr.referencePoint ? `\n📍 Ref: ${addr.referencePoint}` : ''}`;

  const deliveryText = isPickup
    ? 'GRÁTIS'
    : order.deliveryFee === 0
      ? 'A CONFIRMAR'
      : formatCurrency(order.deliveryFee);

  return `🍲 *NOVO PEDIDO - ${settings.storeName.toUpperCase()}* 🍲
━━━━━━━━━━━━━━━━━━━━
📦 *Pedido:* #${order.orderNumber}
👤 *Cliente:* ${order.customer.name}
📱 *WhatsApp:* ${order.customer.phone}

📍 *Endereço de Entrega:*
${addressText}

🥣 *ITENS DO PEDIDO:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* ${formatCurrency(order.subtotal)}
${
  order.discount > 0
    ? `🏷️ *Desconto:* -${formatCurrency(order.discount)} (${order.couponCode || 'Cupom'})\n`
    : ''
}🛵 *Taxa de Entrega:* ${deliveryText}
💵 *TOTAL A PAGAR:* *${formatCurrency(order.total)}*

💳 *Forma de Pagamento:* ${
    paymentNames[order.customer.paymentMethod] ||
    order.customer.paymentMethod
  }
${
  order.notes
    ? `\n📝 *Observações Gerais:* ${order.notes}`
    : ''
}
━━━━━━━━━━━━━━━━━━━━
_Pedido realizado pelo aplicativo Natural Fruit Linha Sopas Detox!_ 🌱`;
}

export function getWhatsAppLink(phone: string, text: string): string {
  const cleanedPhone = phone.replace(/\D/g, '');

  // Default to 55 (Brazil) if country code not included
  const fullPhone = cleanedPhone.startsWith('55')
    ? cleanedPhone
    : `55${cleanedPhone}`;

  return `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(
    text
  )}`;
}

export function generateOrderNumber(): number {
  return Math.floor(1000 + Math.random() * 9000);
}