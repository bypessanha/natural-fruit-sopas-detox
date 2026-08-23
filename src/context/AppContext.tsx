import React, { createContext, useContext, useState, useEffect } from 'react';
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
  name: 'Cliente Saudável',
  phone: '(31) 98765-4321',
  email: 'cliente@detox.com',
  authProvider: 'guest',
  addresses: [
    {
      id: 'addr_1',
      label: 'Casa',
      street: 'Av. Afonso Pena',
      number: '1500',
      neighborhood: 'Savassi',
      city: 'Belo Horizonte',
      complement: 'Apto 402',
      referencePoint: 'Próximo à Praça da Savassi',
      isDefault: true,
    },
  ],
  defaultAddressId: 'addr_1',
  favoriteProductIds: ['sopa-1', 'combo-semana'],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSession, setAdminSession] = useState<any>(null);

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setAdminSession(data.session);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setAdminSession(session);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);
  const [activeOrderFilter, setActiveOrderFilter] = useState<
    OrderStatus | 'todos'
  >('todos');

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });
// colocar nova função aqui
const loadProductsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');

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
      originalPrice:
        p.original_price != null
          ? Number(p.original_price)
          : undefined,
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
};

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

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_orders');

      if (saved) {
        return JSON.parse(saved);
      }

      return [
        {
          id: 'ord_init_1',
          orderNumber: 1042,
          customer: {
            name: 'Mariana Silva',
            phone: '(31) 9.9189-9312',
            address: {
              id: 'addr_sample',
              label: 'Casa',
              street: 'Rua dos Inconfidentes',
              number: '820',
              neighborhood: 'Funcionários',
              city: 'Belo Horizonte',
              complement: 'Bloco B, Ap 301',
              isDefault: true,
            },
            paymentMethod: 'pix',
          },
          items: [
            {
              product: INITIAL_PRODUCTS[0],
              quantity: 2,
              observation: 'Caprichar no gengibre!',
            },
            {
              product: INITIAL_PRODUCTS[2],
              quantity: 1,
            },
          ],
          subtotal: 105.0,
          discount: 10.0,
          deliveryFee: 10.0,
          total: 105.0,
          status: 'preparando',
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          couponCode: 'BEMVINDO',
        },
      ];
    } catch {
      return [];
    }
  });
    useEffect(() => {
    const loadOrdersFromSupabase = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('ERRO AO CARREGAR PEDIDOS:', error);
        return;
      }

      if (data) {
        const loadedOrders: Order[] = data.map((order: any) => ({
          id: order.id,
          orderNumber: order.order_number,
          customer: order.customer,
          items: order.items,
          subtotal: Number(order.subtotal),
          discount: Number(order.discount),
          deliveryFee: Number(order.delivery_fee),
          total: Number(order.total),
          status: order.status,
          createdAt: order.created_at,
          notes: order.notes,
          couponCode: order.coupon_code,
        }));

        setOrders(loadedOrders);
      }
    };

    loadOrdersFromSupabase();
  }, []);

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('natural_fruit_settings');

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed.whatsapp1 === '31975561467') {
          parsed.whatsapp1 = '31991899312';
        }

        if (parsed.pixKey === '31975561467') {
          parsed.pixKey = '31991899312';
        }

        return parsed;
      }

      return STORE_SETTINGS;
    } catch {
      return STORE_SETTINGS;
    }
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    loadProductsFromSupabase();
}, []);
  

  useEffect(() => {
    localStorage.setItem('natural_fruit_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('natural_fruit_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('natural_fruit_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      'natural_fruit_coupon',
      JSON.stringify(appliedCoupon)
    );
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem(
      'natural_fruit_coupons',
      JSON.stringify(coupons)
    );
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(
      'natural_fruit_settings',
      JSON.stringify(settings)
    );
  }, [settings]);

  const showToast = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    observation?: string
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.observation === observation
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [...prev, { product, quantity, observation }];
    });

    showToast(
      `Adicionado: ${product.name} (${quantity}x)`,
      'success'
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );

    showToast('Item removido do carrinho', 'info');
  };

  const updateQuantity = (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  const deliveryFee = 0;

  let discount = 0;

  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountPercent) {
      discount =
        (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountFixed) {
      discount = Math.min(
        appliedCoupon.discountFixed,
        subtotal
      );
    }
  }

  const total = Math.max(
    0,
    subtotal - discount
  );

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();

    const found = coupons.find(
      (c) =>
        c.code.toUpperCase() === trimmed &&
        c.active
    );

    if (!found) {
      return {
        success: false,
        message: 'Cupom inválido ou expirado.',
      };
    }

    if (
      found.minOrderValue &&
      subtotal < found.minOrderValue
    ) {
      return {
        success: false,
        message: `Valor mínimo para este cupom é de R$ ${found.minOrderValue.toFixed(
          2
        )}.`,
      };
    }

    setAppliedCoupon(found);

    showToast(
      `Cupom ${found.code} aplicado com sucesso!`,
      'success'
    );

    return {
      success: true,
      message: 'Cupom aplicado!',
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupom removido.', 'info');
  };

  const createOrder = (
    customerData: {
      name: string;
      phone: string;
      email?: string;
      address: DeliveryAddress;
      paymentMethod: 'pix' | 'cartao_entrega' | 'dinheiro';
      changeFor?: number;
    },
    notes?: string
  ): Order => {
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

    void supabase
      .from('orders')
      .insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        customer: newOrder.customer,
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
        if (error) {
          console.error(
            'ERRO SUPABASE:',
            error
          );

          showToast(
            'Erro ao salvar pedido no servidor.',
            'error'
          );
        } else {
          console.log(
            'PEDIDO SALVO NO SUPABASE:',
            newOrder.id
          );
        }
      });

    clearCart();

    return newOrder;
  };



  const repeatOrder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(
        item.product,
        item.quantity,
        item.observation
      );
    });

    setActiveTab('cart');

    showToast(
      'Itens do pedido foram adicionados ao seu carrinho!',
      'success'
    );
  };

  const updateUserProfile = (
    data: Partial<UserProfile>
  ) => {
    setUser((prev) => ({
      ...prev,
      ...data,
    }));

    showToast(
      'Perfil atualizado com sucesso!',
      'success'
    );
  };

  const saveAddress = (
    addressData: Omit<DeliveryAddress, 'id'>,
    id?: string
  ) => {
    setUser((prev) => {
      let nextAddresses: DeliveryAddress[];

      if (id) {
        nextAddresses = prev.addresses.map((a) =>
          a.id === id
            ? { ...addressData, id }
            : a
        );
      } else {
        const newAddr: DeliveryAddress = {
          ...addressData,
          id: `addr_${Date.now()}`,
        };

        nextAddresses = [
          ...prev.addresses,
          newAddr,
        ];
      }

      return {
        ...prev,
        addresses: nextAddresses,
        defaultAddressId: addressData.isDefault
          ? id ||
            nextAddresses[
              nextAddresses.length - 1
            ].id
          : prev.defaultAddressId,
      };
    });

    showToast(
      'Endereço salvo com sucesso!',
      'success'
    );
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter(
        (a) => a.id !== id
      ),
      defaultAddressId:
        prev.defaultAddressId === id
          ? undefined
          : prev.defaultAddressId,
    }));

    showToast(
      'Endereço removido',
      'info'
    );
  };

  const toggleFavorite = (productId: string) => {
    setUser((prev) => {
      const isFav =
        prev.favoriteProductIds.includes(
          productId
        );

      const nextFavs = isFav
        ? prev.favoriteProductIds.filter(
            (id) => id !== productId
          )
        : [
            ...prev.favoriteProductIds,
            productId,
          ];

      return {
        ...prev,
        favoriteProductIds: nextFavs,
      };
    });
  };

  const isFavorite = (productId: string) => {
    return user.favoriteProductIds.includes(
      productId
    );
  };

  const loginUser = (
    name: string,
    phone: string,
    email: string,
    provider:
      | 'whatsapp'
      | 'google'
      | 'email'
  ) => {
    setUser((prev) => ({
      ...prev,
      name,
      phone,
      email,
      authProvider: provider,
    }));

    showToast(
      `Conectado com sucesso via ${provider.toUpperCase()}!`,
      'success'
    );
  };

  const logoutUser = () => {
    setUser(DEFAULT_USER);
    showToast(
      'Você saiu da sua conta',
      'info'
    );
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

    showToast(
      'Não foi possível atualizar o produto.',
      'error'
    );

    return;
  }

  setProducts((prev) =>
    prev.map((p) =>
      p.id === updated.id
        ? updated
        : p
    )
  );

   showToast(
    'Produto atualizado com sucesso!',
    'success'
  );
};

const addProduct = (

    showToast(
      `Produto "${updated.name}" atualizado!`,
      'success'
    );
  };

  const addProduct = (
    productData: Omit<Product, 'id'>
  ) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
    };

    setProducts((prev) => [
      ...prev,
      newProduct,
    ]);

      showToast(
    'Novo produto cadastrado com sucesso!',
    'success'
  );
};
const updateSettings = (
  newSettings: Partial<StoreSettings>
) => {
  setSettings((prev) => ({
    ...prev,
    ...newSettings,
  }));

  showToast(
    'Configurações atualizadas com sucesso!',
    'success'
  );
};


const toggleProductStock = (productId: string) => {
  setProducts((prev) =>
    prev.map((product) =>
      product.id === productId
        ? { ...product, inStock: !product.inStock }
        : product
    )
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
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};