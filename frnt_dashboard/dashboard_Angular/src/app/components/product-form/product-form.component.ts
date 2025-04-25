import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    id: '',
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: '',
  };
  isEditing = false;
  categories: string[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadProduct(id);
    }
  }

  loadCategories(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.categories = [...new Set(products.map((p) => p.category))];
      },
    });
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.router.navigate(['/products']);
      },
    });
  }

  saveProduct(): void {
    if (this.isEditing) {
      this.productService.updateProduct(this.product).subscribe({
        next: () => {
          this.router.navigate(['/products', this.product.id]);
        },
        error: (error) => {
          console.error('Error updating product:', error);
        },
      });
    } else {
      this.productService.createProduct(this.product).subscribe({
        next: (product) => {
          this.router.navigate(['/products', product.id]);
        },
        error: (error) => {
          console.error('Error creating product:', error);
        },
      });
    }
  }

  cancel(): void {
    if (this.isEditing) {
      this.router.navigate(['/products', this.product.id]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}
