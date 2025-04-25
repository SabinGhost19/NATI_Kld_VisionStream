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
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log('ProductDetailComponent initialized');
  }

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
    this.loading = true;
    this.error = false;

    console.log(`Loading product details for ID: ${id}`);

    this.productService.getProduct(id).subscribe({
      next: (product) => {
        console.log('Product loaded successfully:', product);
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = true;
        this.errorMessage = 'Nu s-au putut încărca detaliile produsului.';
        this.loading = false;
      },
    });
  }

  loadProductHistory(id: string): void {
    this.productService.getProductHistory(id).subscribe({
      next: (history) => {
        console.log('Product history loaded successfully:', history);
        this.productHistory = history;
      },
      error: (error) => {
        console.error('Error loading product history:', error);
      },
    });
  }

  deleteProduct(): void {
    if (!this.product) return;

    if (confirm(`Sigur doriți să ștergeți produsul ${this.product.name}?`)) {
      this.loading = true;

      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.error = true;
          this.errorMessage = 'Nu s-a putut șterge produsul.';
          this.loading = false;
        },
      });
    }
  }
}
