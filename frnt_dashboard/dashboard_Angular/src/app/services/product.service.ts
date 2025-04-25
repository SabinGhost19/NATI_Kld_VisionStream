import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
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
  // Dezactivăm datele de test pentru a folosi API-ul real
  private useMockData = false; // Folosim doar API-ul real

  private apiUrl = 'http://localhost:8080/api/products';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
    console.log('ProductService initialized');
    console.log(
      'Se folosesc date reale - conectare la API-ul de la ' + this.apiUrl
    );
  }

  // Date de test pentru momentele când serverul nu răspunde
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop Dell XPS 15',
      description: 'Laptop powerful pentru profesioniști',
      price: 5999.99,
      quantity: 15,
      category: 'Laptopuri',
    },
    {
      id: 2,
      name: 'Smartphone Samsung Galaxy S21',
      description: 'Smartphone performant cu cameră excelentă',
      price: 3499.99,
      quantity: 25,
      category: 'Telefoane',
    },
    {
      id: 3,
      name: 'Monitor LG UltraWide',
      description: 'Monitor ultra-wide de 34 inch',
      price: 1799.99,
      quantity: 8,
      category: 'Monitoare',
    },
    {
      id: 4,
      name: 'Tastatură mecanică Logitech',
      description: 'Tastatură pentru gaming cu iluminare RGB',
      price: 449.99,
      quantity: 30,
      category: 'Periferice',
    },
    {
      id: 5,
      name: 'Mouse gaming Razer',
      description: 'Mouse de gaming cu senzor de mare precizie',
      price: 349.99,
      quantity: 4,
      category: 'Periferice',
    },
  ];

  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      console.error(`${operation} failed:`, error);

      if (this.useMockData) {
        console.log('Folosind date mockate pentru', operation);
        return throwError(
          () => new Error(`${operation} failed: ${error.message}`)
        );
      }

      return throwError(
        () => new Error(`${operation} failed: ${error.message}`)
      );
    };
  }

  // Basic CRUD operations
  getProducts(page: number = 0, size: number = 100): Observable<Product[]> {
    console.log(`Calling getProducts(page=${page}, size=${size})`);

    if (this.useMockData) {
      console.log('Returning mock products');
      return new Observable<Product[]>((observer) => {
        setTimeout(() => {
          observer.next(this.mockProducts);
          observer.complete();
        }, 500);
      });
    }

    let params = new HttpParams()
      .append('page', page.toString())
      .append('size', size.toString());

    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
      tap((products) =>
        console.log(`Fetched products (page=${page}, size=${size}):`, products)
      ),
      catchError(this.handleError('getProducts'))
    );
  }

  getProduct(id: string | number): Observable<Product> {
    console.log(`Calling getProduct(${id})`);

    if (this.useMockData) {
      const product = this.mockProducts.find((p) => p.id === Number(id));
      return new Observable<Product>((observer) => {
        setTimeout(() => {
          if (product) {
            observer.next(product);
          } else {
            observer.error(new Error(`Product with id ${id} not found`));
          }
          observer.complete();
        }, 500);
      });
    }

    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap((product) => console.log('Fetched product:', product)),
      catchError(this.handleError(`getProduct id=${id}`))
    );
  }

  createProduct(product: Product): Observable<Product> {
    console.log('Calling createProduct():', product);

    if (this.useMockData) {
      const newProduct = {
        ...product,
        id: Math.floor(Math.random() * 10000), // Generăm un id numeric
      };
      this.mockProducts.push(newProduct);
      return new Observable<Product>((observer) => {
        setTimeout(() => {
          observer.next(newProduct);
          observer.complete();
        }, 500);
      });
    }

    return this.http.post<Product>(this.apiUrl, product, this.httpOptions).pipe(
      tap((newProduct) => console.log('Created product:', newProduct)),
      catchError(this.handleError('createProduct'))
    );
  }

  updateProduct(product: Product): Observable<Product> {
    console.log('Calling updateProduct():', product);

    if (this.useMockData) {
      const index = this.mockProducts.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        this.mockProducts[index] = product;
        return new Observable<Product>((observer) => {
          setTimeout(() => {
            observer.next(product);
            observer.complete();
          }, 500);
        });
      }
    }

    return this.http
      .put<Product>(`${this.apiUrl}/${product.id}`, product, this.httpOptions)
      .pipe(
        tap((updatedProduct) =>
          console.log('Updated product:', updatedProduct)
        ),
        catchError(this.handleError(`updateProduct id=${product.id}`))
      );
  }

  deleteProduct(id: string | number): Observable<any> {
    console.log(`Calling deleteProduct(${id})`);

    if (this.useMockData) {
      const index = this.mockProducts.findIndex((p) => p.id === Number(id));
      if (index !== -1) {
        this.mockProducts.splice(index, 1);
        return new Observable<any>((observer) => {
          setTimeout(() => {
            observer.next({ success: true });
            observer.complete();
          }, 500);
        });
      }
    }

    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap((_) => console.log(`Deleted product id=${id}`)),
      catchError(this.handleError(`deleteProduct id=${id}`))
    );
  }

  // Filtering operations
  getProductsByCategory(category: string | null): Observable<Product[]> {
    console.log(`Calling getProductsByCategory(${category})`);

    if (this.useMockData) {
      const filtered = this.mockProducts.filter((p) => p.category === category);
      return new Observable<Product[]>((observer) => {
        setTimeout(() => {
          observer.next(filtered);
          observer.complete();
        }, 500);
      });
    }

    // Tratez cazul când categoria e null
    if (category === null) {
      return this.getProducts(); // Returnez toate produsele în caz de categorie null
    }

    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`).pipe(
      tap((products) =>
        console.log(`Fetched products for category ${category}:`, products)
      ),
      catchError(this.handleError(`getProductsByCategory category=${category}`))
    );
  }

  getProductsByPrice(filter: PriceFilter): Observable<Product[]> {
    console.log('Calling getProductsByPrice():', filter);

    if (this.useMockData) {
      const filtered = this.mockProducts.filter((p) => {
        if (filter.minPrice !== undefined && p.price < filter.minPrice)
          return false;
        if (filter.maxPrice !== undefined && p.price > filter.maxPrice)
          return false;
        return true;
      });
      return new Observable<Product[]>((observer) => {
        setTimeout(() => {
          observer.next(filtered);
          observer.complete();
        }, 500);
      });
    }

    let params = new HttpParams();
    if (filter.minPrice !== undefined) {
      params = params.append('minPrice', filter.minPrice.toString());
    }
    if (filter.maxPrice !== undefined) {
      params = params.append('maxPrice', filter.maxPrice.toString());
    }

    return this.http.get<Product[]>(`${this.apiUrl}/price`, { params }).pipe(
      tap((products) => console.log('Fetched products by price:', products)),
      catchError(this.handleError('getProductsByPrice'))
    );
  }

  getLowStockProducts(threshold: number = 10): Observable<Product[]> {
    console.log(`Calling getLowStockProducts(${threshold})`);

    if (this.useMockData) {
      const filtered = this.mockProducts.filter((p) => p.quantity <= threshold);
      return new Observable<Product[]>((observer) => {
        setTimeout(() => {
          observer.next(filtered);
          observer.complete();
        }, 500);
      });
    }

    return this.http
      .get<Product[]>(`${this.apiUrl}/low-stock?threshold=${threshold}`)
      .pipe(
        tap((products) =>
          console.log(
            `Fetched low stock products (threshold=${threshold}):`,
            products
          )
        ),
        catchError(
          this.handleError(`getLowStockProducts threshold=${threshold}`)
        )
      );
  }

  getProductsByCategoryAndMaxPrice(
    category: string | null,
    maxPrice: number
  ): Observable<Product[]> {
    console.log(
      `Calling getProductsByCategoryAndMaxPrice(${category}, ${maxPrice})`
    );

    if (this.useMockData) {
      const filtered = this.mockProducts.filter(
        (p) => p.category === category && p.price <= maxPrice
      );
      return new Observable<Product[]>((observer) => {
        setTimeout(() => {
          observer.next(filtered);
          observer.complete();
        }, 500);
      });
    }

    // Tratez cazul când categoria e null
    if (category === null) {
      return this.getProductsByPrice({ maxPrice }); // Folosesc doar filtrul de preț maxim
    }

    return this.http
      .get<Product[]>(
        `${this.apiUrl}/category/${category}/max-price/${maxPrice}`
      )
      .pipe(
        tap((products) =>
          console.log(
            `Fetched products for category ${category} with max price ${maxPrice}:`,
            products
          )
        ),
        catchError(
          this.handleError(
            `getProductsByCategoryAndMaxPrice category=${category}, maxPrice=${maxPrice}`
          )
        )
      );
  }

  getAvailableProductsByCategory(
    category: string | null,
    minimumQuantity: number = 1
  ): Observable<Product[]> {
    console.log(
      `Calling getAvailableProductsByCategory(${category}, ${minimumQuantity})`
    );

    if (this.useMockData) {
      const filtered = this.mockProducts.filter(
        (p) => p.category === category && p.quantity >= minimumQuantity
      );
      return new Observable<Product[]>((observer) => {
        setTimeout(() => {
          observer.next(filtered);
          observer.complete();
        }, 500);
      });
    }

    // Tratez cazul când categoria e null
    if (category === null) {
      // Returnez produse disponibile fără filtrare după categorie
      return this.http
        .get<Product[]>(
          `${this.apiUrl}/available?minimumQuantity=${minimumQuantity}`
        )
        .pipe(
          tap((products) =>
            console.log(
              `Fetched available products with minimum quantity ${minimumQuantity}:`,
              products
            )
          ),
          catchError(
            this.handleError(
              `getAvailableProducts minimumQuantity=${minimumQuantity}`
            )
          )
        );
    }

    return this.http
      .get<Product[]>(
        `${this.apiUrl}/category/${category}/available?minimumQuantity=${minimumQuantity}`
      )
      .pipe(
        tap((products) =>
          console.log(
            `Fetched available products for category ${category}:`,
            products
          )
        ),
        catchError(
          this.handleError(
            `getAvailableProductsByCategory category=${category}, minimumQuantity=${minimumQuantity}`
          )
        )
      );
  }

  // History operations
  getProductHistory(id: string): Observable<ProductChange[]> {
    console.log(`Calling getProductHistory(${id})`);

    if (this.useMockData) {
      // Simulare istoric
      const mockHistory: ProductChange[] = [
        {
          productId: id,
          timestamp: new Date().toISOString(),
          changeType: 'UPDATE',
          oldValue: 'price: 99.99',
          newValue: 'price: 120.99',
        },
      ];
      return new Observable<ProductChange[]>((observer) => {
        setTimeout(() => {
          observer.next(mockHistory);
          observer.complete();
        }, 500);
      });
    }

    return this.http.get<ProductChange[]>(`${this.apiUrl}/${id}/history`).pipe(
      tap((history) =>
        console.log(`Fetched history for product ${id}:`, history)
      ),
      catchError(this.handleError(`getProductHistory id=${id}`))
    );
  }

  getProductHistoryByPeriod(
    id: string,
    period: HistoryPeriodFilter
  ): Observable<ProductChange[]> {
    console.log(`Calling getProductHistoryByPeriod(${id})`, period);

    if (this.useMockData) {
      // Simulare istoric
      const mockHistory: ProductChange[] = [
        {
          productId: id,
          timestamp: new Date().toISOString(),
          changeType: 'UPDATE',
          oldValue: 'price: 99.99',
          newValue: 'price: 120.99',
        },
      ];
      return new Observable<ProductChange[]>((observer) => {
        setTimeout(() => {
          observer.next(mockHistory);
          observer.complete();
        }, 500);
      });
    }

    let params = new HttpParams()
      .append('startTime', period.startTime)
      .append('endTime', period.endTime);

    return this.http
      .get<ProductChange[]>(`${this.apiUrl}/${id}/history/period`, { params })
      .pipe(
        tap((history) =>
          console.log(`Fetched history for product ${id} by period:`, history)
        ),
        catchError(this.handleError(`getProductHistoryByPeriod id=${id}`))
      );
  }

  getRecentChanges(since: string): Observable<ProductChange[]> {
    console.log(`Calling getRecentChanges(${since})`);

    if (this.useMockData) {
      // Simulare schimbări recente
      const mockChanges: ProductChange[] = [
        {
          productId: '1',
          timestamp: new Date().toISOString(),
          changeType: 'UPDATE',
          oldValue: 'price: 99.99',
          newValue: 'price: 120.99',
        },
        {
          productId: '2',
          timestamp: new Date().toISOString(),
          changeType: 'CREATE',
          oldValue: '',
          newValue: 'New product',
        },
      ];
      return new Observable<ProductChange[]>((observer) => {
        setTimeout(() => {
          observer.next(mockChanges);
          observer.complete();
        }, 500);
      });
    }

    return this.http
      .get<ProductChange[]>(`${this.apiUrl}/recent-changes?since=${since}`)
      .pipe(
        tap((changes) =>
          console.log(`Fetched recent changes since ${since}:`, changes)
        ),
        catchError(this.handleError(`getRecentChanges since=${since}`))
      );
  }
}
