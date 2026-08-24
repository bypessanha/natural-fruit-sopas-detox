export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'sopas' | 'combos' | 'especiais';
  price: number;
  originalPrice?: number;
  volume: string;
  ingredients: string[];
  benefits: string[];
  description: string;
  prepTime: string;
  calories: number;
  image: string;
  badge?: string;
  isHighlighted?: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  dietaryTags: string[];
  accentColor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  observation?: string;
}

export type OrderStatus = 'recebido' | 'preparando' | 'saiu_para_entrega' | 'entregue' | 'cancelado';

export interface DeliveryAddress {
  id: string;
  label: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  complement?: string;
  referencePoint?: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  user_id?: string;
  orderNumber: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: DeliveryAddress;
    paymentMethod: 'pix' | 'cartao_entrega' | 'dinheiro';
    changeFor?: number;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
  couponCode?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  authProvider: 'whatsapp' | 'google' | 'email' | 'guest';
  addresses: DeliveryAddress[];
  defaultAddressId?: string;
  favoriteProductIds: string[];
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountPercent?: number;
  discountFixed?: number;
  minOrderValue?: number;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsapp1: string;
  whatsapp2: string;
  address: string;
  openingHours: string;
  deliveryFee: number;
  freeDeliveryAbove: number;
  pixKey: string;
  pixKeyType: 'telefone' | 'cnpj' | 'cpf' | 'email' | 'aleatoria';
  pixRecipientName: string;
  pixCity: string;
  isStoreOpen: boolean;
}

export type ActiveTab = 'home' | 'products' | 'cart' | 'orders' | 'profile' | 'admin';
