import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: 'add-product',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: 'edit-product/:id',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./components/category-view/category-view.component').then(
        (m) => m.CategoryViewComponent
      ),
  },
  {
    path: 'low-stock',
    loadComponent: () =>
      import('./components/low-stock/low-stock.component').then(
        (m) => m.LowStockComponent
      ),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./components/history/history.component').then(
        (m) => m.HistoryComponent
      ),
  },
  { path: '**', redirectTo: 'products' },
];
