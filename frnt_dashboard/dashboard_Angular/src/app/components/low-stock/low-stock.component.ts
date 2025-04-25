import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './low-stock.component.html',
  styleUrls: ['./low-stock.component.scss'],
})
export class LowStockComponent implements OnInit {
  products: Product[] = [];
  threshold: number = 10;
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadLowStockProducts();
  }

  loadLowStockProducts(): void {
    this.loading = true;
    this.productService.getLowStockProducts(this.threshold).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading low stock products:', error);
        this.loading = false;
      },
    });
  }

  updateThreshold(): void {
    this.loadLowStockProducts();
  }
}
