export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
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
