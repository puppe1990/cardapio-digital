import { Product, RestaurantConfig } from '../types';

export const RESTAURANT_DEFAULT_CONFIG: RestaurantConfig = {
  name: "GastroBurger & Pizza Artisan",
  whatsappNumber: "5511999999999", // Editable in-app for seamless testing
  logo: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=150&auto=format&fit=crop&q=80",
  heroBanner: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
  address: "Av. Paulista, 1000 - Cerqueira César, São Paulo - SP",
  workingHours: "Terça a Domingo das 18:00 às 23:30",
  deliveryFee: 7.00,
  minimumOrder: 20.00
};

export const MENU_CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'favorites', name: '❤️ Favoritos' },
  { id: 'burgers', name: '👑 Hambúrgueres' },
  { id: 'pizzas', name: '🍕 Pizzas' },
  { id: 'portions', name: '🍟 Porções' },
  { id: 'drinks', name: '🥤 Bebidas' },
  { id: 'desserts', name: '🍰 Sobremesas' }
];

export const PRODUCTS: Product[] = [
  // Hambúrgueres
  {
    id: "burger-classic",
    name: "Classic Smash Cheese",
    description: "Blend artesanal de 120g prensado na chapa com perfeição, queijo cheddar derretido, maionese artesanal da casa, picles de pepino e pão brioche macio na manteiga.",
    price: 24.90,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Mais Vendido", "Smash"],
    promo: true
  },
  {
    id: "burger-bacon",
    name: "Double Bacon Cheddar",
    description: "Dois blends de 100g smash, muito bacon crocante fatiado, dobro de queijo cheddar cremoso, onion rings integradas e molho barbecue defumado no pão australiano.",
    price: 34.90,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Destaque"]
  },
  {
    id: "burger-chicken",
    name: "Chicken Supreme Gorgonzola",
    description: "Peito de frango empanado super crocante de 140g, creme suave de queijo gorgonzola, alface americana fresca, rodelas de tomate e maionese verde artesanal.",
    price: 28.90,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Novidade"]
  },
  {
    id: "burger-vegan",
    name: "Artisan Veggie",
    description: "Hambúrguer de grão de bico e ervas finas de 120g, queijo de castanha derretido, rúcula fresca baby, tomate seco, maionese vegana no pão brioche vegano.",
    price: 29.90,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Vegano"]
  },

  // Pizzas
  {
    id: "pizza-margherita",
    name: "Margherita di Bufala",
    description: "Molho de tomate pelado italiano, muçarela de búfala fresca, tomates cereja doces confitados, basílico fresco (manjericão) e um fio de azeite extra virgem.",
    price: 46.00,
    category: "pizzas",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Clássica"]
  },
  {
    id: "pizza-calabresa",
    name: "Calabresa Especial com Rúcula",
    description: "Molho rústico da casa, muçarela premium, generosas fatias de linguiça calabresa defumada artesanal, cebola roxa cortada fina, folhas de rúcula e azeitonas pretas.",
    price: 49.90,
    category: "pizzas",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Top 1"],
    promo: true
  },
  {
    id: "pizza-formaggi",
    name: "Quattro Formaggi & Mel",
    description: "Base cremosa de molho de tomates, queijos selecionados: Muçarela, Gorgonzola Dolce, Provolone defumado, Catupiry Original. Finalizada com fios de mel de flor de laranjeira.",
    price: 52.00,
    category: "pizzas",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Artesanal"]
  },

  // Porções
  {
    id: "portion-fries",
    name: "Fritas Rústicas Gourmet",
    description: "Porção de batatas fritas rústicas com casca, temperadas com páprica defumada e alecrim fresco. Acompanha cremoso molho cheddar e bacon bits hiper crocantes.",
    price: 22.00,
    category: "portions",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Para Compartilhar"]
  },
  {
    id: "portion-rings",
    name: "Onion Rings Supremas",
    description: "Anéis de cebola gigantes empanados em farinha Panko super crocante, fritos até dourarem perfeitamente. Acompanha maionese defumada artesanal de chimichurri.",
    price: 19.90,
    category: "portions",
    image: "https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?w=600&auto=format&fit=crop&q=80",
    available: true
  },
  {
    id: "portion-chicken-bites",
    name: "Crispy Chicken Goujons",
    description: "Tiras de coxa e sobrecoxa marinadas em especiarias e empanadas de forma ultra crocante. Servidas com barbecue artesanal de goiabada.",
    price: 27.90,
    category: "portions",
    image: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Favorito"]
  },

  // Bebidas
  {
    id: "drink-soda",
    name: "Coca-Cola Lata Zero",
    description: "Lata de 350ml trincando de gelada. Acompanha copo com gelo e uma fatia fresca de limão siciliano.",
    price: 6.50,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
    available: true
  },
  {
    id: "drink-juice",
    name: "Suco de Laranja Integral",
    description: "Suco 100% natural espremido na hora. Sem adição de açúcares, conservantes ou água. 400ml de refrescância pura.",
    price: 9.90,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80",
    available: true
  },
  {
    id: "drink-beer-artisan",
    name: "Cerveja IPA Craft 500ml",
    description: "Cerveja artesanal local estilo India Pale Ale. Aromática, amargor médio, com notas cítricas de maracujá e lúpulo proeminente.",
    price: 18.90,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Álcool"]
  },

  // Sobremesas
  {
    id: "dessert-gateau",
    name: "Lava Cake Petit Gâteau",
    description: "Bolo quente de chocolate belga trufado com recheio cremoso escorrendo, finalizado com cacau puro polvilhado e uma generosa bola de sorvete de creme artesanal.",
    price: 21.90,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    available: true,
    tags: ["Queridinho"],
    promo: true
  },
  {
    id: "dessert-cheesecake",
    name: "Cheesecake de Frutas Vermelhas",
    description: "Base crocante de biscoito amantecado com recheio aveludado de cream cheese e uma cobertura brilhante e fresca de calda artesanal de framboesa, amora e morango.",
    price: 19.90,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?w=600&auto=format&fit=crop&q=80",
    available: true
  }
];
