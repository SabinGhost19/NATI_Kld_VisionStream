import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: (string | null)[] = [];
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  lowStockThreshold: number = 10;
  loading: boolean = false;
  error: string | null = null;

  // Adăugare suport pentru paginare
  currentPage: number = 0;
  pageSize: number = 100;
  hasMoreProducts: boolean = true;

  constructor(private productService: ProductService, private router: Router) {
    console.log('ProductListComponent initialized');
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.currentPage = 0;
    this.products = [];

    console.log('Loading products...');

    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (products) => {
        console.log('Products loaded successfully:', products);
        this.products = products;
        this.hasMoreProducts = products.length === this.pageSize;

        // Extract unique categories, excluding null values
        this.categories = [
          ...new Set(
            products
              .filter((p) => p.category !== null)
              .map((p) => p.category as string)
          ),
        ];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error =
          'Nu s-au putut încărca produsele. Verificați conexiunea la server.';
        this.loading = false;
      },
    });
  }

  loadMoreProducts(): void {
    if (!this.hasMoreProducts || this.loading) return;

    this.loading = true;
    this.currentPage++;

    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (products) => {
        console.log(
          `Additional products loaded (page ${this.currentPage}):`,
          products
        );
        this.products = [...this.products, ...products];
        this.hasMoreProducts = products.length === this.pageSize;
        this.loading = false;

        // Update categories
        const newCategories = [...new Set(products.map((p) => p.category))];
        this.categories = [...new Set([...this.categories, ...newCategories])];
      },
      error: (error) => {
        console.error(
          `Error loading more products (page ${this.currentPage}):`,
          error
        );
        this.currentPage--; // Revert page increment on error
        this.loading = false;
      },
    });
  }

  filterByCategory(): void {
    if (!this.selectedCategory) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.error = null;

    this.productService.getProductsByCategory(this.selectedCategory).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering by category:', error);
        this.error = 'Nu s-au putut filtra produsele după categorie.';
        this.loading = false;
      },
    });
  }

  filterByPrice(): void {
    if (this.minPrice === null && this.maxPrice === null) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.error = null;

    const filter = {
      minPrice: this.minPrice !== null ? this.minPrice : undefined,
      maxPrice: this.maxPrice !== null ? this.maxPrice : undefined,
    };

    this.productService.getProductsByPrice(filter).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering by price:', error);
        this.error = 'Nu s-au putut filtra produsele după preț.';
        this.loading = false;
      },
    });
  }

  filterLowStock(): void {
    this.loading = true;
    this.error = null;

    this.productService.getLowStockProducts(this.lowStockThreshold).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering low stock products:', error);
        this.error = 'Nu s-au putut filtra produsele cu stoc redus.';
        this.loading = false;
      },
    });
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.lowStockThreshold = 10;
    this.loadProducts();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Sunteți sigur că doriți să ștergeți acest produs?')) {
      this.productService.deleteProduct(id.toString()).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.id !== id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Eroare la ștergerea produsului.');
        },
      });
    }
  }
}
