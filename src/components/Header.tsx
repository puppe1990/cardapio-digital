import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Clock, Settings, Phone, Check, Sun, Moon } from 'lucide-react';
import { RestaurantConfig } from '../types';
import { MENU_CATEGORIES } from '../data/menu';

interface HeaderProps {
  config: RestaurantConfig;
  onUpdateConfig: (newConfig: RestaurantConfig) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({
  config,
  onUpdateConfig,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempWhatsapp, setTempWhatsapp] = useState(config.whatsappNumber);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Strip unnecessary non-digit characters except for sending
    const cleaned = tempWhatsapp.replace(/\D/g, '');
    onUpdateConfig({
      ...config,
      whatsappNumber: cleaned || config.whatsappNumber,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  return (
    <header className="relative w-full overflow-hidden bg-natural-surface shadow-xs border-b border-natural-border">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 lg:h-72 w-full bg-stone-900">
        <img
          src={config.heroBanner}
          alt={config.name}
          className="absolute inset-0 h-full w-full object-cover opacity-60 filter saturate-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
        
        {/* Floating actions (Theme & Settings) */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 bg-natural-surface/90 backdrop-blur-md rounded-full text-natural-primary hover:bg-natural-surface hover:scale-105 active:scale-95 transition shadow-md border border-natural-border cursor-pointer"
            title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
            id="btn-toggle-theme"
            type="button"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Settings button to customize WhatsApp */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 bg-natural-surface/90 backdrop-blur-md rounded-full text-natural-primary hover:bg-natural-surface hover:scale-105 active:scale-95 transition shadow-md border border-natural-border cursor-pointer"
            title="Configurar WhatsApp"
            id="btn-settings-whatsapp"
            type="button"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Restaurant Profile details */}
      <div className="max-w-4xl mx-auto px-4 pb-4 -mt-16 md:-mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left mb-4">
          <div className="h-28 w-28 rounded-3xl bg-natural-surface p-1.5 shadow-xl border border-natural-border overflow-hidden shrink-0">
            <img
              src={config.logo}
              alt="Logo"
              className="h-full w-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 pb-1">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-natural-primary tracking-tight">
              {config.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
              <span className="px-2.5 py-0.5 bg-natural-border text-natural-primary text-[11px] uppercase tracking-wider rounded-full font-bold">
                Aberto Agora
              </span>
              <span className="text-xs text-natural-muted">
                • {config.workingHours}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-natural-text py-3 border-t border-b border-natural-border">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-natural-primary shrink-0" />
            <span className="truncate text-natural-text font-medium">{config.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-natural-primary shrink-0" />
            <span className="text-natural-muted">Tempo médio: 30-45 min</span>
          </div>
          <div className="flex items-center gap-2 sm:col-span-1">
            <Phone className="h-4 w-4 text-natural-secondary shrink-0" />
            <span className="text-natural-text">Pedir no WhatsApp: <strong className="text-natural-primary">{config.whatsappNumber}</strong></span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#EBD5C9]/60 text-natural-secondary px-2.5 py-0.5 rounded-full text-xs font-bold">
              Taxa Entrega: R$ {config.deliveryFee.toFixed(2).replace('.', ',')}
            </span>
            <span className="bg-natural-border/60 text-natural-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
              Pedido Mínimo: R$ {config.minimumOrder.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-natural-muted" />
          <input
            type="text"
            placeholder="O que você deseja saborear hoje? Pesquise aqui..."
            className="w-full pl-11 pr-4 py-3 bg-natural-surface-alt/40 border border-natural-border rounded-xl text-natural-text placeholder-natural-muted focus:outline-none focus:ring-2 focus:ring-natural-primary/20 focus:border-natural-primary focus:bg-natural-surface text-sm md:text-base transition"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            id="input-menu-search"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-natural-muted hover:text-natural-primary px-1 py-1"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Categories Horizontal Navigation */}
        <div className="mt-5 overflow-x-auto no-scrollbar -mx-4 px-4 flex items-center gap-2.5 pb-1">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`py-2 px-6 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-300 transform active:scale-95 shrink-0 select-none ${
                    isActive
                    ? 'bg-natural-primary text-white border border-natural-primary shadow-sm'
                    : 'bg-natural-surface border border-natural-border text-natural-primary hover:bg-natural-surface-alt'
                }`}
                id={`btn-category-${cat.id}`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* WhatsApp Configuration Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-natural-surface rounded-3xl w-full max-w-md overflow-hidden relative z-10 shadow-2xl border border-natural-border"
          >
            <div className="bg-natural-primary text-white p-6">
              <h3 className="font-serif font-bold text-xl text-[#F7F3EE]">Configurações para Teste</h3>
              <p className="text-xs text-[#E8E1D9] mt-1">Configure o WhatsApp de destino para receber os pedidos de teste.</p>
            </div>
            <form onSubmit={handleSaveSettings} className="p-6 bg-natural-surface-alt/40">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-natural-text uppercase tracking-wide mb-1.5">
                    WhatsApp do Estabelecimento (com DDD e Código do País)
                  </label>
                  <p className="text-xs text-natural-muted mb-2">Exemplo para o Brasil: <code className="bg-natural-surface px-1 py-0.5 rounded border border-natural-border">5511999999999</code></p>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 border border-natural-border rounded-xl text-natural-text bg-natural-surface face-mono focus:outline-none focus:ring-2 focus:ring-natural-primary/20 focus:border-natural-primary text-sm placeholder-natural-muted/60"
                    placeholder="Ex: 5511999999999"
                    value={tempWhatsapp}
                    onChange={(e) => setTempWhatsapp(e.target.value)}
                    id="input-whatsapp-num"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-natural-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 border border-natural-border text-natural-primary bg-natural-surface rounded-xl hover:bg-natural-surface-alt transition text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saveSuccess}
                  className="px-5 py-2 bg-natural-primary hover:bg-natural-primary/95 text-white rounded-xl transition text-sm font-semibold shadow-sm flex items-center justify-center gap-1 min-w-[100px]"
                  id="btn-save-whatsapp"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-200" />
                      Salvo!
                    </>
                  ) : 'Salvar'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </header>
  );
}
