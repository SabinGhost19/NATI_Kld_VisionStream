import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product, ProductChange } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  productHistory: ProductChange[] = [];
  loading = true;
  error = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
      this.loadProductHistory(id);
    } else {
      this.router.navigate(['/products']);
    }
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = true;
        this.loading = false;
      },
    });
  }

  loadProductHistory(id: string): void {
    this.productService.getProductHistory(id).subscribe({
      next: (history) => {
        this.productHistory = history;
      },
      error: (error) => {
        console.error('Error loading product history:', error);
      },
    });
  }

  deleteProduct(): void {
    if (!this.product) return;

    if (confirm(`Are you sure you want to delete ${this.product.name}?`)) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        },
      });
    }
  }
}
