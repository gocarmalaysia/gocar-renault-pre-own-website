
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CarCardComponent } from '../car-card/car-card.component';
import { Car, CarService } from '../../services/car.service';

@Component({
  selector: 'app-public-listing',
  templateUrl: './public-listing.component.html',
  imports: [CommonModule, NgOptimizedImage, CarCardComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicListingComponent {
  private carService = inject(CarService);

  private cars = this.carService.getAllCars;

  // Signals for filter and sort state
  selectedStatus = signal('All');
  selectedModel = signal('All');
  selectedLocation = signal('All');
  sortBy = signal('Default');

  // Computed signals for dynamic dropdown options
  models = computed(() => ['All', ...Array.from(new Set(this.cars().map(c => c.name)))]);
  locations = computed(() => ['All', ...Array.from(new Set(this.cars().map(c => c.location)))]);

  // Computed signal for filtered and sorted cars
  filteredCars = computed(() => {
    let cars = this.cars();

    // Filtering logic
    if (this.selectedStatus() !== 'All') {
      cars = cars.filter(c => c.status === this.selectedStatus());
    }
    if (this.selectedModel() !== 'All') {
      cars = cars.filter(c => c.name === this.selectedModel());
    }
    if (this.selectedLocation() !== 'All') {
      cars = cars.filter(c => c.location === this.selectedLocation());
    }

    // Sorting logic
    switch (this.sortBy()) {
      case 'Price: Low to High':
        cars = [...cars].sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        cars = [...cars].sort((a, b) => b.price - a.price);
        break;
      case 'Year: Newest':
        cars = [...cars].sort((a, b) => b.year - a.year);
        break;
    }

    return cars;
  });

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
