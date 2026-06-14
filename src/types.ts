export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type OrderType = 'delivery' | 'pickup' | 'table';

export type PaymentMethod = 'pix' | 'money' | 'card_credit' | 'card_debit';

export interface OrderDetails {
  customerName: string;
  phone: string;
  orderType: OrderType;
  tableNumber?: string;
  address?: string;
  neighborhood?: string;
  paymentMethod: PaymentMethod;
  changeFor?: string;
  observation?: string;
}

export interface RestaurantConfig {
  name: string;
  whatsappNumber: string; // Dynamic or default number
  logo: string;
  heroBanner: string;
  address: string;
  workingHours: string;
  deliveryFee: number;
  minimumOrder: number;
}
