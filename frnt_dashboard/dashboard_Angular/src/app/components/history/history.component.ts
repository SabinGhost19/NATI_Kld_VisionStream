import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductChange } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  recentChanges: ProductChange[] = [];
  sinceDate: string = '';
  loading = true;

  constructor(private productService: ProductService) {
    // Default to last 7 days
    const date = new Date();
    date.setDate(date.getDate() - 7);
    this.sinceDate = date.toISOString().slice(0, 10); // YYYY-MM-DD format
  }

  ngOnInit(): void {
    this.loadRecentChanges();
  }

  loadRecentChanges(): void {
    this.loading = true;
    const isoDate = new Date(this.sinceDate).toISOString();

    this.productService.getRecentChanges(isoDate).subscribe({
      next: (changes) => {
        this.recentChanges = changes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recent changes:', error);
        this.loading = false;
      },
    });
  }

  updateDateRange(): void {
    this.loadRecentChanges();
  }
}
