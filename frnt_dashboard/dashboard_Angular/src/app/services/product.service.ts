import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Product,
  ProductChange,
  PriceFilter,
  HistoryPeriodFilter,
} from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // Basic CRUD operations
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, this.httpOptions);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/${product.id}`,
      product,
      this.httpOptions
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Filtering operations
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  getProductsByPrice(filter: PriceFilter): Observable<Product[]> {
    let params = new HttpParams();
    if (filter.minPrice !== undefined) {
      params = params.append('minPrice', filter.minPrice.toString());
    }
    if (filter.maxPrice !== undefined) {
      params = params.append('maxPrice', filter.maxPrice.toString());
    }
    return this.http.get<Product[]>(`${this.apiUrl}/price`, { params });
  }

  getLowStockProducts(threshold: number = 10): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/low-stock?threshold=${threshold}`
    );
  }

  getProductsByCategoryAndMaxPrice(
    category: string,
    maxPrice: number
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/category/${category}/max-price/${maxPrice}`
    );
  }

  getAvailableProductsByCategory(
    category: string,
    minimumQuantity: number = 1
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/category/${category}/available?minimumQuantity=${minimumQuantity}`
    );
  }

  // History operations
  getProductHistory(id: string): Observable<ProductChange[]> {
    return this.http.get<ProductChange[]>(`${this.apiUrl}/${id}/history`);
  }

  getProductHistoryByPeriod(
    id: string,
    period: HistoryPeriodFilter
  ): Observable<ProductChange[]> {
    let params = new HttpParams()
      .append('startTime', period.startTime)
      .append('endTime', period.endTime);
    return this.http.get<ProductChange[]>(
      `${this.apiUrl}/${id}/history/period`,
      { params }
    );
  }

  getRecentChanges(since: string): Observable<ProductChange[]> {
    return this.http.get<ProductChange[]>(
      `${this.apiUrl}/recent-changes?since=${since}`
    );
  }
}
