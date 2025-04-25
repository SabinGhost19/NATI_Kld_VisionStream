export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string | null;
}

export interface ProductChange {
  id?: string;
  productId: string;
  timestamp: string;
  changeType: string;
  oldValue: string;
  newValue: string;
}

export interface PriceFilter {
  minPrice?: number;
  maxPrice?: number;
}

export interface HistoryPeriodFilter {
  startTime: string;
  endTime: string;
}
