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
    id: 0,
    name: '',
    description: null,
    price: 0,
    quantity: 0,
    category: null,
  };
  isEditing = false;
  categories: (string | null)[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log('ProductFormComponent initialized');
  }

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadProduct(id);
    } else {
      this.loading = false;
    }
  }

  loadCategories(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Categories loaded successfully');
        this.categories = [
          ...new Set(
            products.filter((p) => p.category !== null).map((p) => p.category)
          ),
        ];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  loadProduct(id: string): void {
    this.loading = true;

    this.productService.getProduct(id).subscribe({
      next: (product) => {
        console.log('Product loaded successfully for editing:', product);
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Nu s-a putut încărca produsul pentru editare.';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 3000);
      },
    });
  }

  saveProduct(): void {
    this.loading = true;

    if (this.isEditing) {
      this.productService.updateProduct(this.product).subscribe({
        next: () => {
          console.log('Product updated successfully');
          this.router.navigate(['/products', this.product.id]);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.error = 'Nu s-a putut actualiza produsul.';
          this.loading = false;
        },
      });
    } else {
      this.productService.createProduct(this.product).subscribe({
        next: (product) => {
          console.log('Product created successfully:', product);
          this.router.navigate(['/products', product.id]);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.error = 'Nu s-a putut crea produsul.';
          this.loading = false;
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
