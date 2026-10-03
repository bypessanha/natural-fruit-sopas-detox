import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ActiveTab,
  CartItem,
  Coupon,
  DeliveryAddress,
  Order,
  OrderStatus,
  Product,
  StoreSettings,
  UserProfile,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  STORE_SETTINGS,
} from '../data/initialData';
import { generateOrderNumber } from '../utils/helpers';
import { supabase } from '../lib/supabase';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, observation?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  coupons: Coupon[];
  orders: Order[];
  createOrder: (
    customerData: {
      name: string;
      phone: string;
      email?: string;
      address: DeliveryAddress;
      paymentMethod: 'pix' | 'cartao_entrega' | 'dinheiro';
      changeFor?: number;
    },
    notes?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  repeatOrder: (order: Order) => void;
  user: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  saveAddress: (address: Omit<DeliveryAddress, 'id'>, id?: string) => void;
  deleteAddress: (id: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  loginUser: (
    name: string,
    phone: string,
    email: string,
    provider: 'whatsapp' | 'google' | 'email'
  ) => void;
  logoutUser: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  toggleProductStock: (id: string) => void;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  toasts: Toast[];
  showToast: (
    message: string,
    type?: 'success' | 'info' | 'warning' | 'error'
  ) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  activeOrderFilter: OrderStatus | 'todos';
  setActiveOrderFilter: (status: OrderStatus | 'todos') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: 'usr_default',
  name: '',
  phone: '',
  email: '',
  authProvider: 'guest',
  addresses: [],
  favoriteProductIds: [],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // 1. Estados declarados na raiz do Provider
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeOrderFilter, setActiveOrderFilter] = useState<OrderStatus | 'todos'>('todos');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          whatsapp1: parsed.whatsapp1 === '31975561467' ? '31991899312' : parsed.whatsapp1,
          pixKey: parsed.pixKey === '31975561467' ? '31991899312' : parsed.pixKey,
        };
      }
      return STORE_SETTINGS;
    } catch {
      return STORE_SETTINGS;
    }
  });

  // 2. Auxiliares e Métodos
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const loadProductsFromSupabase = useCallback(async () => {
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) {
      console.error('ERRO AO CARREGAR PRODUTOS DO SUPABASE:', error);
      return;
    }

    if (data) {
      const mappedProducts: Product[] = data.map((p) => ({
        id: p.id,
        name: p.name,
        subtitle: p.subtitle,
        category: p.category,
        price: Number(p.price),
        originalPrice: p.original_price != null ? Number(p.original_price) : undefined,
        volume: p.volume,
        ingredients: p.ingredients,
        benefits: p.benefits,
        description: p.description,
        prepTime: p.prep_time,
        calories: Number(p.calories),
        image: p.image,
        badge: p.badge ?? undefined,
        isHighlighted: p.is_highlighted,
        inStock: p.in_stock,
        rating: Number(p.rating),
        reviewCount: Number(p.review_count),
        dietaryTags: p.dietary_tags,
        accentColor: p.accent_color,
      }));
      setProducts(mappedProducts);
    }
  }, []);
useEffect(() => {
  const syncSupabaseUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return;

    setUser((prev) => ({
      ...prev,
      name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || prev.name,
      email: authUser.email || prev.email,
      authProvider: 'google',
    }));
  };

  syncSupabaseUser();
}, []);
  // 3. Efeitos de Sincronização
  useEffect(() => {
    loadProductsFromSupabase();
  }, [loadProductsFromSupabase]);
 
  const loadCouponsFromSupabase = useCallback(async () => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('id');

  if (error) {
    console.error('ERRO AO CARREGAR CUPONS DO SUPABASE:', error);
    return;
  }

  if (data) {
    const loadedCoupons: Coupon[] = data.map((coupon) => ({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountPercent:
        coupon.discount_percent != null
          ? Number(coupon.discount_percent)
          : undefined,
      discountFixed:
        coupon.discount_fixed != null
          ? Number(coupon.discount_fixed)
          : undefined,
      minOrderValue:
        coupon.min_order_value != null
          ? Number(coupon.min_order_value)
          : undefined,
      active: coupon.active,
    }));

    setCoupons(loadedCoupons);
  }
}, []);
useEffect(() => {
  loadCouponsFromSupabase();
}, [loadCouponsFromSupabase]);
  // Sincronização com LocalStorage
  useEffect(() => { localStorage.setItem('natural_fruit_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('natural_fruit_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('natural_fruit_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('natural_fruit_coupon', JSON.stringify(appliedCoupon)); }, [appliedCoupon]);
  useEffect(() => { localStorage.setItem('natural_fruit_settings', JSON.stringify(settings)); }, [settings]);

  // 4. Ações da Aplicação
  const addToCart = (product: Product, quantity = 1, observation?: string) => {
    if (!product.inStock) {
      showToast('Este produto está temporariamente indisponível.', 'error');
      return;
    }
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.observation === observation
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, observation }];
    });
    showToast(`Adicionado: ${product.name} (${quantity}x)`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removido do carrinho', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = 0;

  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountPercent) {
      discount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountFixed) {
      discount = Math.min(appliedCoupon.discountFixed, subtotal);
    }
  }

  const total = Math.max(0, subtotal - discount);

  const applyCoupon = async (code: string) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.active);

    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }
    if (found.minOrderValue && subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Valor mínimo para este cupom é de R$ ${found.minOrderValue.toFixed(2)}.`,
      };
    }
if (found.code === 'BEMVINDO') {
  if (!authUser) {
    return {
      success: false,
      message: 'Para usar o cupom BEMVINDO, entre ou cadastre-se primeiro.',
    };
  }

  const { count, error } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', authUser.id);

  if (error) {
    console.error('ERRO AO VERIFICAR PRIMEIRO PEDIDO:', error);
    return {
      success: false,
      message: 'Não foi possível verificar o primeiro pedido.',
    };
  }

  if ((count ?? 0) > 0) {
    return {
      success: false,
      message: 'O cupom BEMVINDO é válido somente para o primeiro pedido.',
    };
  }
}
    setAppliedCoupon(found);
    showToast(`Cupom ${found.code} aplicado com sucesso!`, 'success');
    return { success: true, message: 'Cupom aplicado!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupom removido.', 'info');
  };
const toggleCouponActive = async (couponId: string) => {
  const coupon = coupons.find((c) => c.id === couponId);

  if (!coupon) {
    showToast('Cupom não encontrado.', 'error');
    return;
  }

  const newActive = !coupon.active;

  const { error } = await supabase
    .from('coupons')
    .update({ active: newActive })
    .eq('id', couponId);

  if (error) {
    console.error('ERRO AO ATUALIZAR CUPOM:', error);
    showToast('Não foi possível atualizar o status do cupom.', 'error');
    return;
  }

  setCoupons((prev) =>
    prev.map((item) =>
      item.id === couponId
        ? { ...item, active: newActive }
        : item
    )
  );

  showToast('Status do cupom atualizado.', 'success');
};
   const createOrder = async (
      customerData: {
      name: string;
      phone: string;
      email?: string;
      address: DeliveryAddress;
      paymentMethod: 'pix' | 'cartao_entrega' | 'dinheiro';
      changeFor?: number;
    },
    notes?: string
    ): Promise<Order> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
        console.log('USUARIO SUPABASE:', authUser);
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: generateOrderNumber(),
      customer: customerData,
      items: [...cart],
      subtotal,
      discount,
      deliveryFee,
      total,
      status: 'recebido',
      createdAt: new Date().toISOString(),
      notes,
      couponCode: appliedCoupon?.code,
    };

    setOrders((prev) => [newOrder, ...prev]);

    await supabase
      .from('orders')
      .insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        customer: newOrder.customer,
        user_id: authUser?.id ?? null,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        discount: newOrder.discount,
        delivery_fee: newOrder.deliveryFee,
        total: newOrder.total,
        status: newOrder.status,
        notes: newOrder.notes ?? null,
        coupon_code: newOrder.couponCode ?? null,
      })
      .then(({ error }) => {
        if (error) console.error('ERRO SUPABASE:', error);
      });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    void supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .then(({ error }) => {
        if (error) {
          console.error('ERRO AO ATUALIZAR STATUS NO SUPABASE:', error);
          showToast('Erro ao atualizar pedido no servidor.', 'error');
        }
      });

    showToast(`Status do pedido atualizado para: ${status.toUpperCase()}`, 'info');
  };

  const repeatOrder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity, item.observation);
    });
    setActiveTab('cart');
    showToast('Itens do pedido foram adicionados ao seu carrinho!', 'success');
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
    showToast('Perfil atualizado com sucesso!', 'success');
  };

  const saveAddress = (addressData: Omit<DeliveryAddress, 'id'>, id?: string) => {
    setUser((prev) => {
      let nextAddresses: DeliveryAddress[];
      if (id) {
        nextAddresses = prev.addresses.map((a) => (a.id === id ? { ...addressData, id } : a));
      } else {
        const newAddr: DeliveryAddress = { ...addressData, id: `addr_${Date.now()}` };
        nextAddresses = [...prev.addresses, newAddr];
      }

      return {
        ...prev,
        addresses: nextAddresses,
        defaultAddressId: addressData.isDefault
          ? id || nextAddresses[nextAddresses.length - 1].id
          : prev.defaultAddressId,
      };
    });
    showToast('Endereço salvo com sucesso!', 'success');
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
      defaultAddressId: prev.defaultAddressId === id ? undefined : prev.defaultAddressId,
    }));
    showToast('Endereço removido', 'info');
  };

  const toggleFavorite = (productId: string) => {
    setUser((prev) => {
      const isFav = prev.favoriteProductIds.includes(productId);
      const nextFavs = isFav
        ? prev.favoriteProductIds.filter((id) => id !== productId)
        : [...prev.favoriteProductIds, productId];

      return { ...prev, favoriteProductIds: nextFavs };
    });
  };

  const isFavorite = (productId: string) => user.favoriteProductIds.includes(productId);

  const loginUser = (
    name: string,
    phone: string,
    email: string,
    provider: 'whatsapp' | 'google' | 'email'
  ) => {
    setUser((prev) => ({ ...prev, name, phone, email, authProvider: provider }));
    showToast(`Conectado com sucesso via ${provider.toUpperCase()}!`, 'success');
  };

  const logoutUser = () => {
    setUser(DEFAULT_USER);
    showToast('Você saiu da sua conta', 'info');
  };

  const updateProduct = async (updated: Product) => {
    const { error } = await supabase
      .from('products')
      .update({
        name: updated.name,
        subtitle: updated.subtitle,
        category: updated.category,
        price: updated.price,
        original_price: updated.originalPrice ?? null,
        volume: updated.volume,
        ingredients: updated.ingredients,
        benefits: updated.benefits,
        description: updated.description,
        prep_time: updated.prepTime,
        calories: updated.calories,
        image: updated.image,
        badge: updated.badge ?? null,
        is_highlighted: updated.isHighlighted ?? false,
        in_stock: updated.inStock,
        rating: updated.rating,
        review_count: updated.reviewCount,
        dietary_tags: updated.dietaryTags,
        accent_color: updated.accentColor,
      })
      .eq('id', updated.id);

    if (error) {
      console.error('ERRO AO ATUALIZAR PRODUTO:', error);
      showToast('Não foi possível atualizar o produto.', 'error');
      return;
    }

    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('Produto atualizado com sucesso!', 'success');
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...productData, id: `prod_${Date.now()}` };
    setProducts((prev) => [...prev, newProduct]);
    showToast('Novo produto cadastrado com sucesso!', 'success');
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Configurações atualizadas com sucesso!', 'success');
  };

  const toggleProductStock = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      showToast('Produto não encontrado.', 'error');
      return;
    }

    const newInStock = !product.inStock;
    const { error } = await supabase
      .from('products')
      .update({ in_stock: newInStock })
      .eq('id', productId);

    if (error) {
      console.error('ERRO AO ATUALIZAR ESTOQUE:', error);
      showToast('Não foi possível atualizar o estoque.', 'error');
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: newInStock } : p))
    );

    showToast(
      newInStock ? 'Produto reativado com sucesso!' : 'Produto pausado com sucesso!',
      'success'
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        products,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discount,
        deliveryFee,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        coupons,
        toggleCouponActive,
        orders,
        createOrder,
        updateOrderStatus,
        repeatOrder,
        user,
        updateUserProfile,
        saveAddress,
        deleteAddress,
        toggleFavorite,
        isFavorite,
        loginUser,
        logoutUser,
        isAdmin,
        setIsAdmin,
        updateProduct,
        addProduct,
        toggleProductStock,
        settings,
        updateSettings,
        toasts,
        showToast,
        isShareModalOpen,
        setIsShareModalOpen,
        activeOrderFilter,
        setActiveOrderFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};