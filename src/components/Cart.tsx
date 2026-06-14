import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, X, Plus, Minus, Trash2, MapPin, 
  Store, MessageSquare, CreditCard, Coins, Check, AlertCircle, Info 
} from 'lucide-react';
import { CartItem, OrderDetails, OrderType, PaymentMethod, RestaurantConfig } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  config: RestaurantConfig;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  config,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartProps) {
  // Order details form state
  const [details, setDetails] = useState<OrderDetails>({
    customerName: '',
    phone: '',
    orderType: 'delivery',
    tableNumber: '',
    address: '',
    neighborhood: '',
    paymentMethod: 'pix',
    changeFor: '',
    observation: '',
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  // Subtotal calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const isDelivery = details.orderType === 'delivery';
  const deliveryCost = isDelivery ? config.deliveryFee : 0;
  const total = subtotal + deliveryCost;

  const handleOrderTypeChange = (type: OrderType) => {
    setDetails((prev) => ({ ...prev, orderType: type }));
    setFormErrors([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!details.customerName.trim()) {
      errors.push('O nome é obrigatório.');
    }
    if (!details.phone.trim()) {
      errors.push('O número de telefone/celular é obrigatório.');
    }

    if (details.orderType === 'delivery') {
      if (!details.address?.trim()) {
        errors.push('O endereço para entrega é obrigatório.');
      }
      if (!details.neighborhood?.trim()) {
        errors.push('O bairro para entrega é obrigatório.');
      }
    }

    if (details.orderType === 'table' && !details.tableNumber?.trim()) {
      errors.push('Insira o número da mesa.');
    }

    if (details.paymentMethod === 'money' && details.changeFor) {
      const changeVal = parseFloat(details.changeFor.replace(',', '.'));
      if (isNaN(changeVal) || changeVal <= total) {
        errors.push('O valor para troco deve ser maior que o total do pedido!');
      }
    }

    if (subtotal < config.minimumOrder) {
      errors.push(`O valor mínimo para pedidos é R$ ${config.minimumOrder.toFixed(2).replace('.', ',')}.`);
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Build the formatted order text for WhatsApp
    const separator = "------------------------------------------";
    let orderMsg = `*🍔 NOVO PEDIDO RECEBIDO!* \n`;
    orderMsg += `${separator}\n`;
    orderMsg += `*Cliente:* ${details.customerName}\n`;
    orderMsg += `*Contato:* ${details.phone}\n`;
    
    if (details.orderType === 'delivery') {
      orderMsg += `*Tipo:* 🛵 Delivery (Entrega)\n`;
      orderMsg += `*Endereço:* ${details.address}\n`;
      orderMsg += `*Bairro:* ${details.neighborhood}\n`;
    } else if (details.orderType === 'pickup') {
      orderMsg += `*Tipo:* 🥡 Retirada no Local\n`;
    } else {
      orderMsg += `*Tipo:* 🍽️ Na Mesa\n`;
      orderMsg += `*Mesa:* ${details.tableNumber}\n`;
    }
    orderMsg += `${separator}\n\n`;

    orderMsg += `*📋 ITENS SOLICITADOS:*\n`;
    cartItems.forEach((item) => {
      const itemSub = item.product.price * item.quantity;
      orderMsg += `*${item.quantity}x* ${item.product.name} (R$ ${item.product.price.toFixed(2).replace('.', ',')})\n`;
      if (item.notes?.trim()) {
        orderMsg += `   _Obs: ${item.notes}_\n`;
      }
      orderMsg += `   => R$ ${itemSub.toFixed(2).replace('.', ',')}\n\n`;
    });

    orderMsg += `${separator}\n`;
    orderMsg += `*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    if (details.orderType === 'delivery') {
      orderMsg += `*Taxa de Entrega:* R$ ${deliveryCost.toFixed(2).replace('.', ',')}\n`;
    }
    orderMsg += `*👉 TOTAL DO PEDIDO: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
    orderMsg += `${separator}\n\n`;

    // Payment Info
    let paymentString = '';
    if (details.paymentMethod === 'pix') paymentString = '⚡ Pix';
    else if (details.paymentMethod === 'card_credit') paymentString = '💳 Cartão de Crédito';
    else if (details.paymentMethod === 'card_debit') paymentString = '💳 Cartão de Débito';
    else {
      paymentString = '💵 Dinheiro (Espécie)';
      if (details.changeFor) {
        const changeNum = parseFloat(details.changeFor.replace(',', '.'));
        const changeToProvide = changeNum - total;
        paymentString += `\n   _Troco para R$ ${changeNum.toFixed(2).replace('.', ',')}_`;
        paymentString += `\n   _Preparar Troco de R$ ${changeToProvide.toFixed(2).replace('.', ',')}_`;
      } else {
        paymentString += `\n   _Não precisa de troco_`;
      }
    }
    orderMsg += `*Forma de Pagamento:* ${paymentString}\n`;

    if (details.observation?.trim()) {
      orderMsg += `\n*Anotações Gerais:* ${details.observation}\n`;
    }
    
    orderMsg += `${separator}\n`;
    orderMsg += `Pedido feito via *Cardápio Digital* ✨`;

    // Encode URL parameter
    const encodedMessage = encodeURIComponent(orderMsg);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${encodedMessage}`;

    // Open WhatsApp link
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Cart Contents Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-full max-w-xl bg-natural-surface h-full relative z-10 flex flex-col shadow-2xl border-l border-natural-border"
          >
            {/* Drawer Header */}
            <div className="bg-natural-primary text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-6 w-6 text-[#F7F3EE]" />
                <div>
                  <h2 className="font-serif font-bold text-lg text-white">Meu Pedido</h2>
                  <p className="text-[10px] text-[#E8E1D9]">
                    {cartItems.length} {cartItems.length === 1 ? 'item selecionado' : 'itens selecionados'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/15 text-[#F7F3EE] hover:bg-white/20 hover:text-white transition"
                id="btn-close-cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main scrollable grid area */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 bg-natural-surface">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="p-5 bg-natural-surface-alt rounded-full border border-natural-border">
                    <ShoppingBag className="h-10 w-10 text-natural-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-natural-primary text-lg">Seu carrinho está vazio</h3>
                    <p className="text-xs text-natural-muted mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                      Explore nosso cardápio e monte um pedido com as nossas deliciosas opções artesanais!
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-natural-primary hover:bg-natural-primary/95 text-[#F7F3EE] rounded-xl font-bold text-xs shadow-xs transition"
                    id="btn-back-to-menu-empty"
                  >
                    Voltar ao Cardápio
                  </button>
                </div>
              ) : (
                <>
                  {/* Item List */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center pb-2 border-b border-natural-border">
                      <h3 className="text-xs font-bold text-natural-primary uppercase tracking-wider">Itens Selecionados</h3>
                      <button
                        onClick={onClearCart}
                        className="text-xs text-natural-secondary hover:text-natural-secondary/80 font-bold flex items-center gap-1 transition"
                        title="Esvaziar"
                        id="btn-clear-cart"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Limpar carrinho
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div 
                          key={item.product.id}
                          className="flex items-start gap-3 p-3 bg-natural-surface-alt/40 border border-natural-border rounded-2xl hover:border-natural-primary/20 transition relative"
                        >
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="h-14 w-14 object-cover rounded-xl shrink-0 border border-natural-border"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-natural-primary truncate leading-snug">
                              {item.product.name}
                            </h4>
                            <p className="text-[11px] font-extrabold text-natural-secondary mt-0.5">
                              R$ {item.product.price.toFixed(2).replace('.', ',')}
                            </p>
                            
                            {item.notes && (
                              <p className="text-[10px] text-natural-muted mt-1 italic flex items-center gap-1 bg-natural-surface border border-natural-border px-2 py-0.5 rounded-lg inline-block">
                                <span className="text-natural-secondary font-bold">Obs:</span> {item.notes}
                              </p>
                            )}
                          </div>

                          {/* Item Actions */}
                          <div className="flex flex-col items-end justify-between self-stretch">
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-natural-muted hover:text-red-500 transition p-0.5"
                              title="Remover"
                              id={`btn-remove-item-${item.product.id}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            
                            <div className="flex items-center gap-1.5 bg-natural-surface border border-natural-border rounded-lg p-0.5 mt-2 shadow-xs">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 hover:bg-natural-surface-alt rounded text-natural-muted hover:text-natural-primary"
                                id={`btn-cart-dec-${item.product.id}`}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center font-display font-bold text-natural-text text-xs">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 hover:bg-natural-surface-alt rounded text-natural-muted hover:text-natural-primary"
                                id={`btn-cart-inc-${item.product.id}`}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Location & Identification Form */}
                  <div className="border-t border-natural-border pt-5 space-y-4">
                    <h3 className="text-xs font-bold text-natural-primary uppercase tracking-wider pb-1">
                      Dados para Entrega / Pedido
                    </h3>

                    {/* Order Type Toggle Group */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOrderTypeChange('delivery')}
                        className={`flex flex-col items-center gap-1.5 py-2 px-3 rounded-xl border text-center transition ${
                          details.orderType === 'delivery'
                            ? 'bg-natural-primary/10 border-natural-primary text-natural-primary font-bold shadow-xs'
                            : 'bg-natural-surface border-natural-border text-natural-muted hover:bg-natural-surface-alt/50'
                        }`}
                        id="btn-type-delivery"
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="text-[10px] md:text-xs">🛵 Delivery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOrderTypeChange('pickup')}
                        className={`flex flex-col items-center gap-1.5 py-2 px-3 rounded-xl border text-center transition ${
                          details.orderType === 'pickup'
                            ? 'bg-natural-primary/10 border-natural-primary text-natural-primary font-bold shadow-xs'
                            : 'bg-natural-surface border-natural-border text-natural-muted hover:bg-natural-surface-alt/50'
                        }`}
                        id="btn-type-pickup"
                      >
                        <Store className="h-4 w-4" />
                        <span className="text-[10px] md:text-xs">🥡 Retirada</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOrderTypeChange('table')}
                        className={`flex flex-col items-center gap-1.5 py-2 px-3 rounded-xl border text-center transition ${
                          details.orderType === 'table'
                            ? 'bg-natural-primary/10 border-natural-primary text-natural-primary font-bold shadow-xs'
                            : 'bg-natural-surface border-natural-border text-natural-muted hover:bg-natural-surface-alt/50'
                        }`}
                        id="btn-type-table"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-[10px] md:text-xs">🍽️ Na Mesa</span>
                      </button>
                    </div>

                    {/* Generic Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-natural-primary uppercase tracking-wide mb-1"> Seu Nome <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          name="customerName"
                          placeholder="Como podemos lhe chamar?"
                          className="w-full px-3.5 py-2.5 border border-natural-border rounded-xl text-xs text-natural-text bg-natural-surface focus:outline-none focus:ring-2 focus:ring-natural-primary/20 focus:border-natural-primary shadow-2xs"
                          value={details.customerName}
                          onChange={handleInputChange}
                          id="input-customer-name"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-natural-primary uppercase tracking-wide mb-1"> Seu Celular <span className="text-red-500">*</span></label>
                        <input
                          type="tel"
                          required
                          name="phone"
                          placeholder="Ex: (11) 99999-9999"
                          className="w-full px-3.5 py-2.5 border border-natural-border rounded-xl text-xs text-natural-text bg-natural-surface focus:outline-none focus:ring-2 focus:ring-natural-primary/20 focus:border-natural-primary font-mono shadow-2xs"
                          value={details.phone}
                          onChange={handleInputChange}
                          id="input-customer-phone"
                        />
                      </div>
                    </div>

                    {/* Delivery specific inputs */}
                    {details.orderType === 'delivery' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3.5 bg-natural-surface-alt/60 p-4 rounded-xl border border-natural-border"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-bold text-natural-primary uppercase mb-1"> Endereço da Entrega <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              name="address"
                              placeholder="Rua, Número, Apto, Bloco..."
                              className="w-full px-3.5 py-2 border border-natural-border rounded-xl text-xs bg-natural-surface text-natural-text focus:outline-none focus:ring-2 focus:ring-natural-primary/20 focus:border-natural-primary"
                              value={details.address}
                              onChange={handleInputChange}
                              id="input-delivery-address"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-natural-primary uppercase mb-1"> Bairro <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              name="neighborhood"
                              placeholder="Bairro"
                              className="w-full px-3.5 py-2 border border-natural-border rounded-xl text-xs bg-natural-surface text-natural-text focus:outline-none focus:ring-2 focus:ring-natural-primary/20 focus:border-natural-primary"
                              value={details.neighborhood}
                              onChange={handleInputChange}
                              id="input-delivery-neighborhood"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Table-specific input */}
                    {details.orderType === 'table' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-natural-surface-alt/60 p-4 rounded-xl border border-natural-border"
                      >
                        <label className="block text-xs font-bold text-natural-primary uppercase mb-1"> Número da Mesa <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          name="tableNumber"
                          placeholder="Mesa em que está sentado (Ex: 04)"
                          className="w-full max-w-xs px-3.5 py-2 border border-natural-border rounded-xl text-xs bg-natural-surface text-natural-text focus:outline-none focus:ring-2 focus:ring-natural-primary/20 focus:border-natural-primary font-mono"
                          value={details.tableNumber}
                          onChange={handleInputChange}
                          id="input-table-number"
                        />
                      </motion.div>
                    )}

                    {/* Payment preference */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-natural-primary uppercase tracking-wider">Forma de Pagamento</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { id: 'pix', label: 'Pix', icon: Coins },
                          { id: 'money', label: 'Dinheiro', icon: Coins },
                          { id: 'card_credit', label: 'Crédito', icon: CreditCard },
                          { id: 'card_debit', label: 'Débito', icon: CreditCard },
                        ].map((m) => {
                          const isSelected = details.paymentMethod === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setDetails(prev => ({ ...prev, paymentMethod: m.id as PaymentMethod }))}
                              className={`py-2 px-1 text-center rounded-xl border flex flex-col items-center justify-center gap-1 text-[11px] transition ${
                                isSelected 
                                  ? 'bg-natural-primary border-natural-primary text-white font-bold shadow-xs' 
                                  : 'bg-natural-surface border-natural-border text-natural-muted hover:bg-natural-surface-alt'
                              }`}
                              id={`payment-method-${m.id}`}
                            >
                              <m.icon className="h-3.5 w-3.5" />
                              <span>{m.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cash change field */}
                    {details.paymentMethod === 'money' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-natural-surface-alt/60 rounded-xl border border-natural-border"
                      >
                        <label className="block text-xs font-bold text-natural-text mb-1">Precisa de troco para quanto? (Deixe em branco se não precisar)</label>
                        <input
                          type="text"
                          name="changeFor"
                          placeholder="Ex: 50,00 ou 100"
                          className="w-full max-w-xs px-3 py-1.5 border border-natural-border rounded-lg text-xs bg-natural-surface text-natural-text focus:outline-none focus:ring-2 focus:ring-natural-primary/20 focus:border-natural-primary font-mono"
                          value={details.changeFor}
                          onChange={handleInputChange}
                          id="input-cash-change"
                        />
                      </motion.div>
                    )}

                    {/* General observations note */}
                    <div>
                      <label className="block text-xs font-bold text-natural-primary uppercase tracking-wide mb-1">Observações Gerais do Pedido</label>
                      <textarea
                        name="observation"
                        placeholder="Ex: Molho extra, talheres extras, campainha estragada..."
                        className="w-full px-3.5 py-2.5 border border-natural-border rounded-xl text-xs text-natural-text bg-natural-surface focus:outline-none focus:ring-2 focus:ring-natural-primary/20 focus:border-natural-primary min-h-[60px]"
                        value={details.observation}
                        onChange={handleInputChange}
                        id="input-order-observation"
                      />
                    </div>
                  </div>

                  {/* Summary calculations & Submit validations */}
                  <div className="bg-natural-surface-alt border border-natural-border p-4 rounded-3xl space-y-3">
                    <div className="flex justify-between text-xs text-natural-text font-medium">
                      <span>Subtotal dos itens:</span>
                      <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {isDelivery && (
                      <div className="flex justify-between text-xs text-natural-text font-medium">
                        <span>Taxa de entrega:</span>
                        <span>R$ {config.deliveryFee.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    <div className="h-px bg-natural-border my-2" />
                    <div className="flex justify-between items-center text-base font-serif font-bold text-natural-primary">
                      <span>Total final:</span>
                      <span className="text-natural-secondary text-xl font-sans font-extrabold">R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>

                  {/* Form Error Handling Alerts */}
                  {formErrors.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 bg-[#EBD5C9]/30 border border-[#A67C52]/30 text-natural-primary rounded-xl text-xs flex flex-col gap-1 shadow-xs"
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="h-4 w-4 shrink-0 text-natural-secondary" />
                        <span>Atenção:</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-natural-text font-medium">
                        {formErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Complete Order Checkout button */}
                  <div className="relative">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2 select-none"
                      id="btn-submit-order-whatsapp"
                    >
                      <svg className="h-5 w-5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.734-1.46L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 2.015 14.117.99 11.5.99c-5.44 0-9.863 4.373-9.867 9.803-.001 1.765.485 3.49 1.408 5.013l-1.015 3.706 3.822-.988zm13.71-8.156c-.29-.145-1.716-.835-1.982-.932-.266-.096-.46-.145-.654.145-.193.291-.748.932-.917 1.127-.17.194-.339.218-.629.073-.29-.146-1.226-.445-2.333-1.423-.862-.758-1.443-1.693-1.611-1.983-.17-.29-.018-.447.127-.591.13-.13.29-.339.435-.508.145-.17.193-.29.29-.484.096-.194.048-.363-.024-.508-.073-.145-.654-1.55-.896-2.13-.235-.568-.475-.491-.654-.5h-.557c-.193 0-.508.072-.774.362-.266.29-1.016.98-1.016 2.392 0 1.41 1.04 2.774 1.185 2.968.145.193 2.046 3.084 4.954 4.318.692.293 1.233.468 1.655.601.696.219 1.33.187 1.83.113.557-.082 1.716-.69 1.958-1.356.242-.665.242-1.234.17-1.355-.072-.12-.266-.193-.556-.339z" />
                      </svg>
                      <span>Enviar Pedido por WhatsApp</span>

                      {/* Interactive Explanation Tooltip */}
                      <div className="relative inline-flex items-center ml-1">
                        <button
                          type="button"
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowTooltip(!showTooltip);
                          }}
                          className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer text-white/95 hover:text-white flex items-center justify-center focus:outline-none"
                          title="Dúvidas sobre o envio via WhatsApp?"
                          id="btn-whatsapp-info-tooltip"
                        >
                          <Info className="h-4 w-4" />
                        </button>

                        <AnimatePresence>
                          {showTooltip && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute bottom-full mb-3 right-[-4px] sm:right-[-20px] w-64 bg-stone-900 border border-stone-800 p-3.5 rounded-2xl shadow-xl text-left pointer-events-auto z-50 text-white font-normal text-xs"
                              id="info-whatsapp-popover"
                            >
                              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                                <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.734-1.46L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 2.015 14.117.99 11.5.99c-5.44 0-9.863 4.373-9.867 9.803-.001 1.765.485 3.49 1.408 5.013l-1.015 3.706 3.822-.988zm13.71-8.156c-.29-.145-1.716-.835-1.982-.932-.266-.096-.46-.145-.654.145-.193.291-.748.932-.917 1.127-.17.194-.339.218-.629.073-.29-.146-1.226-.445-2.333-1.423-.862-.758-1.443-1.693-1.611-1.983-.17-.29-.018-.447.127-.591.13-.13.29-.339.435-.508.145-.17.193-.29.29-.484.096-.194.048-.363-.024-.508-.073-.145-.654-1.55-.896-2.13-.235-.568-.475-.491-.654-.5h-.557c-.193 0-.508.072-.774.362-.266.29-1.016.98-1.016 2.392 0 1.41 1.04 2.774 1.185 2.968.145.193 2.046 3.084 4.954 4.318.692.293 1.233.468 1.655.601.696.219 1.33.187 1.83.113.557-.082 1.716-.69 1.958-1.356.242-.665.242-1.234.17-1.355-.072-.12-.266-.193-.556-.339z" />
                                </svg>
                                Envio via WhatsApp
                              </p>
                              <p className="text-[11px] leading-relaxed text-stone-300 font-sans">
                                O pedido será enviado como uma mensagem formatada com todos os itens, observações e dados diretamente ao WhatsApp do restaurante.
                              </p>
                              <div className="absolute top-full border-4 border-transparent border-t-stone-900 right-[12px] sm:right-[28px]" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </div>
                  <p className="text-[10px] text-natural-muted text-center">
                    Ao enviar, o WhatsApp abrirá automaticamente com os itens, valores e dados do pedido prontos para envio.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
