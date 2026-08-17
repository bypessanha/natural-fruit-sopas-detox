import { Product, Coupon, StoreSettings, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sopa-1',
    name: 'Abóbora com Gengibre',
    subtitle: 'Leve, termogênica e aveludada',
    category: 'sopas',
    price: 35.0,
    volume: '500ml',
    ingredients: ['Abóbora Cabotiá fresca', 'Gengibre ralado selecionado', 'Azeite extra virgem', 'Temperos verdes naturais'],
    benefits: [
      'Acelera o metabolismo e auxilia no controle de peso',
      'Poderosa ação termogênica e antioxidante',
      'Rica em betacaroteno e vitamina A',
      'Auxilia na digestão e redução de retenção de líquidos'
    ],
    description: 'Sabor marcante e aveludado da abóbora cabotiá cozida lentamente e finalizada com o toque termogênico e refrescante do gengibre fresco. 100% natural, sem adição de açúcar e sem conservantes.',
    prepTime: '5 min (micro-ondas) ou 8 min (panela)',
    calories: 145,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    badge: 'Mais Pedida',
    isHighlighted: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 38,
    dietaryTags: ['100% Natural', 'Sem Açúcar', 'Vegano', 'Sem Glúten', 'Termogênico'],
    accentColor: '#EA580C' // Amber orange
  },
  {
    id: 'sopa-2',
    name: 'Mandioquinha com Frango',
    subtitle: 'Cremosa, nutritiva e reconfortante',
    category: 'sopas',
    price: 35.0,
    volume: '500ml',
    ingredients: ['Mandioquinha (Batata Baroa)', 'Peito de Frango desfiado', 'Cebola', 'Alho', 'Ervas finas'],
    benefits: [
      'Alta concentração de proteínas magras de alto valor biológico',
      'Carboidrato complexo de fácil digestão e energia duradoura',
      'Fortalece o sistema imunológico',
      'Sensação de saciedade prolongada'
    ],
    description: 'A textura incomparável e adocicada da mandioquinha combinada com frango desfiado suculento temperado com alho e ervas finas. Uma refeição completa e revigorante.',
    prepTime: '5 min (micro-ondas) ou 8 min (panela)',
    calories: 220,
    image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=800&q=80',
    badge: 'Favorito',
    isHighlighted: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 45,
    dietaryTags: ['100% Natural', 'Rico em Proteína', 'Sem Glúten', 'Sem Conservantes'],
    accentColor: '#D97706' // Golden amber
  },
  {
    id: 'sopa-3',
    name: 'Caldo Verde Fit',
    subtitle: 'Couve fresca, batata e alho-poró',
    category: 'sopas',
    price: 35.0,
    volume: '500ml',
    ingredients: ['Couve manteiga em tiras finas', 'Batata', 'Alho-poró salteado', 'Azeite de oliva', 'Sal rosa'],
    benefits: [
      'Ação desintoxicante profunda para o fígado',
      'Excelente fonte de ferro, magnésio e ácido fólico',
      'Auxilia no bom funcionamento do trânsito intestinal',
      'Super leve e anti-inflamatório'
    ],
    description: 'Versão leve e saudável da tradicional receita. Preparada com couve fresca crocante, base suave de batata e o aroma sofisticado do alho-poró refogado no azeite.',
    prepTime: '5 min (micro-ondas) ou 8 min (panela)',
    calories: 130,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    badge: 'Detox Master',
    isHighlighted: true,
    inStock: true,
    rating: 4.8,
    reviewCount: 29,
    dietaryTags: ['100% Natural', 'Detox Fígado', 'Vegetariano', 'Sem Glúten', 'Baixas Calorias'],
    accentColor: '#16A34A' // Green
  },
  {
    id: 'sopa-4',
    name: 'Legumes Detox',
    subtitle: 'Mix colorido de abobrinha, cenoura, batata e ervilha',
    category: 'sopas',
    price: 35.0,
    volume: '500ml',
    ingredients: ['Abobrinha fresca', 'Cenoura', 'Batata', 'Vagem macia', 'Ervilha fresca', 'Salsinha e Cebolinha'],
    benefits: [
      'Riquíssima em fibras solúveis e insolúveis',
      'Favorece a eliminação de toxinas e combate o inchaço',
      'Hidratação celular e nutrição balanceada',
      'Zero gorduras saturadas'
    ],
    description: 'Uma explosão de vitaminas e cores naturais! O equilíbrio perfeito entre abobrinha tenra, cenouras doces, batatas, vagens e ervilhas frescas cozidas no ponto ideal.',
    prepTime: '5 min (micro-ondas) ou 8 min (panela)',
    calories: 120,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
    badge: '100% Vegano',
    isHighlighted: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 33,
    dietaryTags: ['100% Natural', 'Vegano', 'Zero Gordura', 'Fibras Naturais', 'Super Leve'],
    accentColor: '#65A30D' // Lime green
  },
  {
    id: 'sopa-5',
    name: 'Creme de Milho com Frango',
    subtitle: 'Sabor caseiro, cremoso e proteico',
    category: 'sopas',
    price: 35.0,
    volume: '500ml',
    ingredients: ['Milho verde fresco selecionado', 'Peito de Frango desfiado', 'Cebola roxa', 'Cheiro-verde picadinho', 'Azeite'],
    benefits: [
      'Carotenoides naturais como luteína que protegem a visão',
      'Proteína de alto valor biológico para saciedade e músculos',
      'Textura cremosa natural sem adição de farinhas ou amido',
      'Rico em vitaminas do complexo B'
    ],
    description: 'Cremoso, acolhedor e nutritivo! Feito com grãos de milho verde cozidos e batidos na medida certa, enriquecido com peito de frango desfiado temperado artesanalmente.',
    prepTime: '5 min (micro-ondas) ou 8 min (panela)',
    calories: 215,
    image: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?auto=format&fit=crop&w=800&q=80',
    badge: 'Cremosa',
    isHighlighted: false,
    inStock: true,
    rating: 5.0,
    reviewCount: 41,
    dietaryTags: ['100% Natural', 'Proteico', 'Sem Amido Adicionado', 'Sem Conservantes'],
    accentColor: '#CA8A04' // Yellow
  },
  {
    id: 'sopa-6',
    name: 'Legumes e Carne',
    subtitle: 'Batata, cenoura, abobrinha e carne bovina macia',
    category: 'sopas',
    price: 35.0,
    volume: '500ml',
    ingredients: ['Carne Bovina magra em cubinhos macios', 'Batata', 'Cenoura', 'Abobrinha', 'Caldo natural de ervas'],
    benefits: [
      'Excelente fonte de ferro e zinco altamente biodisponíveis',
      'Auxilia na recuperação muscular e combate a fadiga',
      'Refeição completa, densa em nutrientes e muito saborosa',
      'Sem adição de caldos industriais ou corantes'
    ],
    description: 'Carne bovina magra cozida até ficar incrivelmente macia, combinada com legumes frescos em um caldo aromático e encorpado. Sabor afetivo com perfil nutricional de excelência.',
    prepTime: '5 min (micro-ondas) ou 8 min (panela)',
    calories: 240,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    badge: 'Proteico',
    isHighlighted: false,
    inStock: true,
    rating: 4.9,
    reviewCount: 36,
    dietaryTags: ['100% Natural', 'Rico em Ferro', 'Proteína Bovina', 'Sem Glúten'],
    accentColor: '#991B1B' // Dark red
  },
  {
    id: 'combo-semana',
    name: 'Combo Para a Semana (7 Sopas + 1 Brinde Surpresa)',
    subtitle: 'Todas as nossas 6 sopas + 1 sopa extra + 1 Brinde Surpresa Saudável!',
    category: 'combos',
    price: 229.0,
    originalPrice: 280.0,
    volume: '7 potes de 500ml + 1 item especial',
    ingredients: [
      '1x Abóbora com Gengibre (500ml)',
      '1x Mandioquinha com Frango (500ml)',
      '1x Caldo Verde Fit (500ml)',
      '1x Legumes Detox (500ml)',
      '1x Creme de Milho com Frango (500ml)',
      '1x Legumes e Carne (500ml)',
      '1x Sopa Detox Especial Extra (500ml)',
      '1x Item Surpresa Saudável para complementar sua semana!'
    ],
    benefits: [
      'Almoço ou jantar garantido para todos os dias da semana',
      'Economia de R$ 51,00 em relação à compra avulsa',
      'Variedade completa de nutrientes e sabores',
      'Brinde exclusivo da Natural Fruit incluído'
    ],
    description: 'Mais praticidade para sua rotina! Leve o kit completo para sua semana saudável. Todas as nossas opções de sopas detox congeladas individualmente para você aquecer e consumir quando quiser.',
    prepTime: 'Pronto para descongelar e aquecer em minutos',
    calories: 180,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    badge: 'Super Economia',
    isHighlighted: true,
    inStock: true,
    rating: 5.0,
    reviewCount: 84,
    dietaryTags: ['Kit Semanal Completo', 'Economize R$ 51', 'Brinde Especial', 'Frete Promocional'],
    accentColor: '#15803D'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'BEMVINDO',
    description: '10% de desconto no seu primeiro pedido',
    discountPercent: 10,
    minOrderValue: 50.0,
    active: true
  },
  {
    id: 'c2',
    code: 'DETOX15',
    description: 'R$ 15,00 OFF em compras acima de R$ 100',
    discountFixed: 15.0,
    minOrderValue: 100.0,
    active: true
  },
  {
    id: 'c3',
    code: 'COMBOSAUDE',
    description: 'R$ 20,00 OFF no Combo Semanal',
    discountFixed: 20.0,
    minOrderValue: 200.0,
    active: true
  }
];

export const STORE_SETTINGS: StoreSettings = {
  storeName: 'Natural Fruit - Linha Sopas Detox',
  tagline: 'Detox e praticidade no seu dia a dia. Sabor que cuida de você! ♡',
  whatsapp1: '31991899312',
  whatsapp2: '31991899312',
  address: 'Belo Horizonte e Região Metropolitana - MG',
  openingHours: 'Segunda a Sábado, das 08h às 19h',
  deliveryFee: 10.0,
  freeDeliveryAbove: 140.0,
  pixKey: '31991899312',
  pixKeyType: 'telefone',
  pixRecipientName: 'Natural Fruit Frutas Congeladas',
  pixCity: 'Belo Horizonte',
  isStoreOpen: true
};

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'sopa-1',
    author: 'Mariana Silva',
    rating: 5,
    date: 'Há 3 dias',
    comment: 'A sopa de abóbora com gengibre é perfeita! Textura muito aveludada e o gengibre na medida certa sem queimar.',
    verified: true
  },
  {
    id: 'r2',
    productId: 'sopa-2',
    author: 'Carlos Eduardo',
    rating: 5,
    date: 'Há 5 dias',
    comment: 'Mandioquinha com frango salvou meus jantares na volta da academia. Muito nutritiva e sustenta de verdade!',
    verified: true
  },
  {
    id: 'r3',
    productId: 'sopa-3',
    author: 'Fernanda Lima',
    rating: 5,
    date: 'Há 1 semana',
    comment: 'O Caldo Verde Fit é leve demais e super saboroso. Dá para sentir a qualidade dos ingredientes frescos.',
    verified: true
  },
  {
    id: 'r4',
    productId: 'combo-semana',
    author: 'Juliana Pires',
    rating: 5,
    date: 'Há 2 dias',
    comment: 'Compro o combo toda semana. Chega super congelado, embalagem impecável e o brinde foi uma delícia!',
    verified: true
  }
];
