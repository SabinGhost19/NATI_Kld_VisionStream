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
  categories: string[] = [];
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  lowStockThreshold: number = 10;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        // Extract unique categories
        this.categories = [...new Set(products.map((p) => p.category))];
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  filterByCategory(): void {
    if (!this.selectedCategory) {
      this.loadProducts();
      return;
    }

    this.productService.getProductsByCategory(this.selectedCategory).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error filtering by category:', error);
      },
    });
  }

  filterByPrice(): void {
    if (this.minPrice === null && this.maxPrice === null) {
      this.loadProducts();
      return;
    }

    const filter = {
      minPrice: this.minPrice !== null ? this.minPrice : undefined,
      maxPrice: this.maxPrice !== null ? this.maxPrice : undefined,
    };

    this.productService.getProductsByPrice(filter).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error filtering by price:', error);
      },
    });
  }

  filterLowStock(): void {
    this.productService.getLowStockProducts(this.lowStockThreshold).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error filtering low stock products:', error);
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

  viewDetails(id: string): void {
    this.router.navigate(['/products', id]);
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.id !== id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        },
      });
    }
  }
}
