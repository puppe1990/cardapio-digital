import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, MessageSquare, ShoppingCart, Check, Heart, Percent } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  cartItem?: CartItem;
  onAddToCart: (product: Product, quantity: number, notes?: string) => void;
  onRemoveFromCart: (productId: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
}

export default function ProductCard({
  product,
  cartItem,
  onAddToCart,
  onRemoveFromCart,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [itemNote, setItemNote] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  const handleAddSimple = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setSuccessAnimation(true);
    setTimeout(() => setSuccessAnimation(false), 1000);
  };

  const handleOpenNoteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setItemNote(cartItem?.notes || '');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQty = cartItem?.quantity || 1;
    onAddToCart(product, currentQty, itemNote);
    setIsNoteModalOpen(false);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentQty = cartItem?.quantity || 0;
    onAddToCart(product, currentQty + 1, cartItem?.notes);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentQty = cartItem?.quantity || 0;
    if (currentQty <= 1) {
      onRemoveFromCart(product.id);
    } else {
      onAddToCart(product, currentQty - 1, cartItem?.notes);
    }
  };

  return (
    <div 
      className="bg-natural-surface rounded-3xl overflow-hidden border border-natural-border shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full group"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Panel */}
      <div className="relative aspect-4/3 w-full bg-[#E0D8CF] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-103 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-40" />
        
        {/* Floating tags */}
        {((product.tags && product.tags.length > 0) || product.promo) && (
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 md:gap-1.5 items-center z-10">
            {product.promo && (
              <span
                className="text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs bg-rose-500 text-white font-extrabold flex items-center gap-1 border border-rose-400/20 active:scale-95 animate-pulse"
                title="Prato em Oferta de Desconto!"
              >
                <Percent className="h-2.5 w-2.5" />
                Em Oferta
              </span>
            )}
            {product.tags && product.tags.map((tag) => {
              let badgeColor = 'bg-white/95 text-natural-primary border border-natural-border';
              if (tag === 'Vegano') badgeColor = 'bg-[#D1DBC2] text-natural-primary font-bold';
              if (tag === 'Destaque' || tag === 'Mais Vendido') badgeColor = 'bg-[#EBD5C9] text-natural-secondary font-bold';
              if (tag === 'Novidade') badgeColor = 'bg-natural-primary text-white font-bold';
              
              return (
                <span
                  key={tag}
                  className={`text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs ${badgeColor}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Floating Favorite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className="absolute top-2.5 right-2.5 z-10 p-2 bg-natural-surface/90 backdrop-blur-md rounded-full text-natural-primary hover:bg-natural-surface transition shadow-md border border-natural-border group/fav"
          title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          id={`btn-fav-${product.id}`}
        >
          <Heart 
            className={`h-4.5 w-4.5 transition-all duration-300 ${
              isFavorite 
                ? 'fill-[#e11d48] text-[#e11d48] scale-110' 
                : 'text-natural-primary group-hover/fav:text-[#e11d48] group-hover/fav:scale-110'
            }`} 
          />
        </button>

        {/* Floating price tag for elegant desktop reading */}
        <div className="absolute bottom-2.5 right-2.5 bg-natural-surface/95 backdrop-blur-xs text-natural-secondary font-display font-extrabold text-sm px-2.5 py-1 rounded-full shadow-sm border border-natural-border">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </div>
      </div>

      {/* Product content info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-bold text-natural-primary text-base md:text-lg tracking-tight leading-snug group-hover:text-natural-secondary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-natural-muted leading-relaxed mt-1.5 line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Selected custom notes indicator */}
        {cartItem?.notes && (
          <div className="mt-2.5 bg-natural-surface-alt border border-natural-border p-2 rounded-xl text-xs text-natural-text flex items-start gap-1">
            <MessageSquare className="h-3.5 w-3.5 text-natural-secondary shrink-0 mt-0.5" />
            <span className="italic line-clamp-2">Obs: "{cartItem.notes}"</span>
          </div>
        )}

        {/* Interactive Controls Panel */}
        <div className="mt-4 pt-3 border-t border-natural-border flex items-center justify-between gap-2.5">
          <div className="flex flex-col">
            <span className="text-[9px] text-natural-muted font-bold uppercase tracking-wider">Valor</span>
            <span className="font-display font-extrabold text-[#A67C52] text-base md:text-lg">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>

          {cartItem ? (
            <div className="flex items-center gap-1.5 bg-natural-surface-alt border border-natural-border rounded-xl p-1">
              <button
                onClick={handleDecrement}
                className="p-1.5 hover:bg-natural-surface rounded-lg hover:shadow-xs transition text-natural-muted hover:text-red-500"
                title="Diminuir"
                id={`btn-dec-${product.id}`}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              
              <span className="w-6 text-center font-display font-bold text-natural-text text-sm">
                {cartItem.quantity}
              </span>
              
              <button
                onClick={handleIncrement}
                className="p-1.5 hover:bg-natural-surface rounded-lg hover:shadow-xs transition text-natural-muted hover:text-emerald-600"
                title="Aumentar"
                id={`btn-inc-${product.id}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={handleOpenNoteModal}
                className={`p-1.5 rounded-lg transition ${
                  cartItem.notes 
                    ? 'text-natural-secondary bg-[#EBD5C9] hover:bg-[#EBD5C9]/80' 
                    : 'text-natural-muted hover:text-natural-primary hover:bg-natural-surface'
                }`}
                title="Adicionar Observação"
                id={`btn-note-${product.id}`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-1.5 items-center">
              {/* Optional customization trigger */}
              <button
                onClick={(e) => {
                  setItemNote('');
                  setIsNoteModalOpen(true);
                }}
                className="p-2 border border-natural-border text-natural-muted hover:text-natural-primary hover:bg-natural-surface-alt rounded-xl transition duration-300"
                title="Adicionar com observação"
                id={`btn-custom-add-${product.id}`}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleAddSimple}
                className={`flex items-center gap-1.5 font-bold text-xs py-2 px-4 rounded-xl shadow-xs hover:shadow-sm transition duration-300 border select-none ${
                  successAnimation
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                    : 'bg-natural-primary hover:bg-natural-primary/95 text-white border-natural-primary'
                }`}
                id={`btn-add-simple-${product.id}`}
              >
                {successAnimation ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" />
                    Adicionado
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Adicionar
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Observation Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={() => setIsNoteModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-natural-surface rounded-3xl w-full max-w-sm overflow-hidden relative z-10 shadow-2xl border border-natural-border"
          >
            <div className="bg-natural-primary text-white p-5 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#F7F3EE]" />
              <div>
                <h3 className="font-serif font-bold text-base text-[#F7F3EE]">Observações</h3>
                <p className="text-[10px] text-[#E8E1D9]">{product.name}</p>
              </div>
            </div>
            
            <form onSubmit={handleSaveNote} className="p-5 bg-natural-surface-alt/40">
              <label className="block text-xs font-semibold text-natural-text mb-2">
                Como você prefere o seu prato? (Ex: Sem cebola, bem passado, ponto da carne, etc.)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-natural-border rounded-xl text-xs text-natural-text bg-natural-surface focus:outline-none focus:ring-2 focus:ring-natural-primary/20 focus:border-natural-primary min-h-[90px] placeholder-natural-muted/50"
                placeholder="Insira as observações do item aqui..."
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                maxLength={140}
                id={`textarea-note-${product.id}`}
              />
              <p className="text-[10px] text-natural-muted text-right mt-1">Máximo 140 caracteres ({itemNote.length}/140)</p>

              <div className="mt-5 flex justify-end gap-2 border-t border-natural-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-3.5 py-1.5 border border-natural-border text-natural-primary bg-natural-surface rounded-xl hover:bg-natural-surface-alt transition text-xs font-semibold"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-natural-primary hover:bg-natural-primary/95 text-white rounded-xl transition text-xs font-semibold shadow-sm"
                  id={`btn-save-note-modal-${product.id}`}
                >
                  Confirmar Obs
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
