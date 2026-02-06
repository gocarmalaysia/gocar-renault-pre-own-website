
import { ChangeDetectionStrategy, Component, computed, effect, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarCardComponent } from '../car-card/car-card.component';
import { Car, CarService } from '../../services/car.service';

@Component({
  selector: 'app-public-listing',
  templateUrl: './public-listing.component.html',
  imports: [CommonModule, CarCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicListingComponent {
  private carService = inject(CarService);

  private allCars = this.carService.getAllCars; // For dropdown options

  // Signals for filter and sort state
  selectedStatus = signal('All');
  selectedModel = signal('All');
  selectedLocation = signal('All');
  sortBy = signal('Default');

  // API-based filtered cars
  filteredCars = signal<Car[]>([]);
  totalCars = signal(0);
  currentPage = signal(1);
  readonly PAGE_SIZE = 10;
  isLoadingMore = signal(false);

  // Computed signals for dynamic dropdown options
  models = computed(() => ['All', ...Array.from(new Set(this.allCars().map(c => c.name)))]);
  locations = computed(() => ['All', ...Array.from(new Set(this.allCars().map(c => c.location)))]);

  isLoading = this.carService.isLoading;

  // Check if there are more cars to load
  hasMoreCars = computed(() => {
    return this.filteredCars().length < this.totalCars();
  });

  constructor() {
    // Load filtered cars whenever filters change
    effect(() => {
      // Track all filter dependencies
      this.selectedStatus();
      this.selectedModel();
      this.selectedLocation();
      this.sortBy();

      // Reset and load cars
      this.resetAndLoadCars();
    });
  }

  // Scroll listener for infinite scroll
  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    // Load more when within 300px of bottom
    if (scrollPosition >= documentHeight - 300 && this.hasMoreCars() && !this.isLoadingMore()) {
      this.loadMore();
    }
  }

  // Load filtered cars from API
  private async loadFilteredCars(append: boolean = false): Promise<void> {
    try {
      if (append) {
        this.isLoadingMore.set(true);
      }

      const result = await this.carService.getFilteredCars({
        status: this.selectedStatus(),
        model: this.selectedModel(),
        location: this.selectedLocation(),
        sortBy: this.sortBy(),
        page: this.currentPage(),
        limit: this.PAGE_SIZE
      });

      if (append) {
        // Append to existing cars
        this.filteredCars.update(cars => [...cars, ...result.cars]);
      } else {
        // Replace with new results
        this.filteredCars.set(result.cars);
      }

      this.totalCars.set(result.total);
    } catch (error) {
      console.error('Error loading filtered cars:', error);
    } finally {
      this.isLoadingMore.set(false);
    }
  }

  // Load more cars (next page)
  loadMore(): void {
    this.currentPage.update(page => page + 1);
    this.loadFilteredCars(true);
  }

  // Reset and load cars from first page
  private resetAndLoadCars(): void {
    this.currentPage.set(1);
    this.loadFilteredCars(false);
  }

  // Event handlers for filter changes
  onStatusChange(event: Event): void {
    this.selectedStatus.set((event.target as HTMLSelectElement).value);
  }

  onModelChange(event: Event): void {
    this.selectedModel.set((event.target as HTMLSelectElement).value);
  }

  onLocationChange(event: Event): void {
    this.selectedLocation.set((event.target as HTMLSelectElement).value);
  }

  onSortChange(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value);
  }
}
