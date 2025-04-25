import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-category-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss'],
})
export class CategoryViewComponent implements OnInit {
  categories: string[] = [];
  products: Product[] = [];
  selectedCategory: string = '';
  maxPrice: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        // Extract unique categories
        this.categories = [...new Set(products.map((p) => p.category))];

        if (this.categories.length > 0 && !this.selectedCategory) {
          this.selectedCategory = this.categories[0];
          this.filterByCategory();
        }
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

  filterByCategoryAndMaxPrice(): void {
    if (!this.selectedCategory || !this.maxPrice) {
      this.filterByCategory();
      return;
    }

    this.productService
      .getProductsByCategoryAndMaxPrice(this.selectedCategory, this.maxPrice)
      .subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (error) => {
          console.error('Error filtering by category and max price:', error);
        },
      });
  }

  getAvailableProductsByCategory(minimumQuantity: number = 1): void {
    if (!this.selectedCategory) return;

    this.productService
      .getAvailableProductsByCategory(this.selectedCategory, minimumQuantity)
      .subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (error) => {
          console.error(
            'Error filtering available products by category:',
            error
          );
        },
      });
  }

  getCategoryProductCount(category: string): number {
    return this.products.filter((p) => p.category === category).length;
  }

  resetFilters(): void {
    this.maxPrice = null;
    this.filterByCategory();
  }
}
