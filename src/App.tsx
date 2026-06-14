import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Info, MessageSquare, ShieldAlert, Heart, MapPin, Copy, Check } from 'lucide-react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import { Product, CartItem, RestaurantConfig } from './types';
import { PRODUCTS, RESTAURANT_DEFAULT_CONFIG } from './data/menu';

export default function App() {
  // Local storage keys
  const LS_CART_KEY = 'artisan_restaurant_cart';
  const LS_CONFIG_KEY = 'artisan_restaurant_config';
  const LS_FAVORITES_KEY = 'artisan_restaurant_favorites';
  const LS_THEME_KEY = 'artisan_restaurant_theme';

  // State configurations
  const [restaurantConfig, setRestaurantConfig] = useState<RestaurantConfig>(RESTAURANT_DEFAULT_CONFIG);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const storedTheme = localStorage.getItem('artisan_restaurant_theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // safe fallback
    }
    return 'light';
  });

  // Sync theme modifications to HTML root element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('artisan_restaurant_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const handleCopyAddress = () => {
    try {
      navigator.clipboard.writeText(restaurantConfig.address);
      setCopiedAddress(true);
      showToast('✓ Endereço copiado para a área de transferência!');
      setTimeout(() => {
        setCopiedAddress(false);
      }, 2000);
    } catch (err) {
      console.error('Erro ao copiar endereço:', err);
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      setTimeout(() => {
        showToast(`✓ Modo ${next === 'light' ? 'Claro' : 'Escuro'} ativado!`);
      }, 50);
      return next;
    });
  };

  // 1. Initial configuration loading and shopping cart retrieval
  useEffect(() => {
    try {
      const storedConfig = localStorage.getItem(LS_CONFIG_KEY);
      if (storedConfig) {
        setRestaurantConfig(JSON.parse(storedConfig));
      }

      const storedCart = localStorage.getItem(LS_CART_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }

      const storedFavorites = localStorage.getItem(LS_FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error("Erro ao carregar dados do LocalStorage", e);
    }
  }, []);

  const handleToggleFavorite = (productId: string) => {
    const isFav = favorites.includes(productId);
    let updatedFavorites: string[];
    if (isFav) {
      updatedFavorites = favorites.filter((id) => id !== productId);
      const product = PRODUCTS.find((p) => p.id === productId);
      showToast(`💔 ${product ? product.name : 'Item'} removido dos favoritos.`);
    } else {
      updatedFavorites = [...favorites, productId];
      const product = PRODUCTS.find((p) => p.id === productId);
      showToast(`❤️ ${product ? product.name : 'Item'} adicionado aos favoritos!`);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  // Sync state modifications to Local Storage
  const handleUpdateConfig = (newConfig: RestaurantConfig) => {
    setRestaurantConfig(newConfig);
    localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(newConfig));
    showToast("✓ Configurações salvas e aplicadas!");
  };

  const handleUpdateCartItems = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem(LS_CART_KEY, JSON.stringify(newItems));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastOpen(true);
    setTimeout(() => {
      setIsToastOpen(false);
    }, 2500);
  };

  // 2. Shopping Cart actions
  const handleAddToCart = (product: Product, quantity: number, notes?: string) => {
    const existingIndex = cartItems.findIndex((item) => item.product.id === product.id);
    const updatedCart = [...cartItems];

    if (existingIndex > -1) {
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity,
        notes: notes !== undefined ? notes : updatedCart[existingIndex].notes
      };
    } else {
      updatedCart.push({
        product,
        quantity,
        notes: notes || ''
      });
      showToast(`🛒 ${product.name} adicionado ao carrinho!`);
    }

    handleUpdateCartItems(updatedCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.product.id !== productId);
    handleUpdateCartItems(updatedCart);
    showToast("🗑️ Item removido do carrinho.");
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const updatedCart = cartItems.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    handleUpdateCartItems(updatedCart);
  };

  const handleClearCart = () => {
    handleUpdateCartItems([]);
    showToast("🧹 Carrinho esvaziado com sucesso.");
  };

  // Simulate active menu processing/filtering delay for loading skeletons
  useEffect(() => {
    setIsLoadingMenu(true);
    const delay = setTimeout(() => {
      setIsLoadingMenu(false);
    }, 450);
    return () => clearTimeout(delay);
  }, [selectedCategory, searchQuery]);

  // 3. Filter and search matching logic
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = 
      selectedCategory === 'all' || 
      (selectedCategory === 'favorites' ? favorites.includes(p.id) : p.category === selectedCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-natural-bg pb-24 md:pb-12 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-natural-surface shadow-sm min-h-screen relative flex flex-col border-x border-natural-border">
        {/* Dynamic Header & Categories Panel */}
        <Header
          config={restaurantConfig}
          onUpdateConfig={handleUpdateConfig}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Main Content Body */}
        <main className="flex-1 p-4 md:p-8">
          {/* Welcome section banner or promo */}
          <div className="mb-8 bg-natural-surface-alt/60 border border-natural-border p-5 rounded-3xl flex items-start gap-4">
            <div className="p-2.5 bg-natural-primary rounded-2xl text-white shrink-0 shadow-sm">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm md:text-base text-natural-primary tracking-tight">Atendimento & Pedidos via WhatsApp</h4>
              <p className="text-xs text-natural-muted mt-1 leading-relaxed font-medium">
                Adicione quantos produtos preferir no carrinho, insira suas preferências e finalize enviando a mensagem diretamente para o nosso atendente. Estaremos prontos para lhe servir com a qualidade de sempre!
              </p>
            </div>
          </div>

          {/* Grid list, skeleton loader, or empty message */}
          {isLoadingMenu ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductCard key={`skeleton-${idx}`} isLoading={true} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-natural-surface rounded-3xl border border-natural-border p-8 max-w-md mx-auto mt-8">
              {selectedCategory === 'favorites' && !searchQuery ? (
                <>
                  <Heart className="h-10 w-10 text-rose-500 mx-auto mb-3 animate-pulse fill-rose-500" />
                  <h3 className="font-serif font-bold text-natural-primary text-base">Sua lista de favoritos está vazia</h3>
                  <p className="text-xs text-natural-muted mt-2 leading-relaxed">
                    Você ainda não adicionou nenhum favorito. Toque no ícone de coração nos itens do cardápio para salvá-los aqui!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                    }}
                    className="mt-5 text-xs font-bold text-natural-secondary hover:text-natural-secondary/80 underline"
                    id="btn-reset-favorites"
                  >
                    Explorar Cardápio
                  </button>
                </>
              ) : (
                <>
                  <Info className="h-10 w-10 text-natural-muted mx-auto mb-3" />
                  <h3 className="font-serif font-bold text-natural-primary text-base">Nenhum produto encontrado</h3>
                  <p className="text-xs text-natural-muted mt-2 leading-relaxed">
                    Não localizamos correspondências para o termo "{searchQuery}" nesta categoria. Tente usar outras palavras-chaves ou selecione outra categoria de pratos.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-5 text-xs font-bold text-natural-secondary hover:text-natural-secondary/80 underline"
                    id="btn-reset-filters"
                  >
                    Ver cardápio completo
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const currentCartItem = cartItems.find((item) => item.product.id === product.id);
                const isFavorite = favorites.includes(product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cartItem={currentCartItem}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                  />
                );
              })}
            </div>
          )}
        </main>

        {/* Dynamic Footer Information Banner */}
        <footer className="bg-natural-surface-alt/40 border-t border-natural-border p-8 text-center text-xs text-natural-muted space-y-4 mt-12">
          <p className="font-serif font-bold text-natural-primary flex items-center justify-center gap-1">
            Feito com <Heart className="h-3.5 w-3.5 text-red-500 fill-current" /> por {restaurantConfig.name}
          </p>
          
          <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto pt-1">
            <p className="text-[11px] text-natural-text font-medium flex items-center gap-1.5 justify-center">
              <MapPin className="h-3.5 w-3.5 text-natural-primary shrink-0" />
              <span>{restaurantConfig.address}</span>
            </p>
            <button
              onClick={handleCopyAddress}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-natural-surface border border-natural-border text-natural-primary rounded-xl text-[11px] font-bold hover:bg-natural-surface-alt/80 hover:text-natural-primary/95 transition shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
              title="Copiar Endereço do Restaurante"
              id="btn-copy-restaurant-address"
              type="button"
            >
              {copiedAddress ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600 font-extrabold">Endereço Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-natural-secondary" />
                  <span>Copiar Endereço</span>
                </>
              )}
            </button>
          </div>

          <p className="leading-relaxed max-w-md mx-auto font-medium text-[11px]">
            Este é um cardápio digital moderno com checkout direto no WhatsApp. Seus dados de preferência e sacola de compras são guardados de forma segura sob a sua privacidade no próprio navegador.
          </p>
        </footer>

        {/* Dynamic Slide-out Sidebar Cart Component */}
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          config={restaurantConfig}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
        />

        {/* Floating Quick Action Sticky Cart Button (For excellent mobile interaction) */}
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-5 right-5 z-30 bg-natural-primary border border-natural-primary text-white shadow-2xl py-3 px-6 rounded-2xl flex items-center gap-3 hover:bg-natural-primary/95 transition-all font-sans shadow-natural-primary/20"
            id="floating-cart-trigger"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5 text-[#F7F3EE]" />
              <span className="absolute -top-2 -right-3.5 bg-natural-secondary text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold border-2 border-natural-primary">
                {cartCount}
              </span>
            </div>
            <div className="text-left leading-tight hidden xs:block">
              <span className="text-[9px] text-[#E8E1D9] block uppercase font-bold tracking-wider">Ver sacola</span>
              <span className="text-sm font-extrabold text-white">R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
            </div>
          </motion.button>
        )}

        {/* Elegant Animated Alerts (Toasts) */}
        <AnimatePresence>
          {isToastOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-5 left-5 z-50 bg-natural-primary text-white border border-natural-primary px-4.5 py-3 rounded-xl shadow-xl text-xs md:text-sm font-bold flex items-center gap-2 max-w-sm"
              id="global-toast-notification"
            >
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
