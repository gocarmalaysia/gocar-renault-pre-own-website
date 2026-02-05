
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Car } from '../../services/car.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarCardComponent {
  car = input.required<Car>();

  currentImageIndex = signal(0);

  nextImage(): void {
    const car = this.car();
    // FIX: Removed redundant null check, as 'car' is a required input.
    const newIndex = (this.currentImageIndex() + 1) % car.imageUrls.length;
    this.currentImageIndex.set(newIndex);
  }

  prevImage(): void {
    const car = this.car();
    // FIX: Removed redundant null check, as 'car' is a required input.
    const newIndex = (this.currentImageIndex() - 1 + car.imageUrls.length) % car.imageUrls.length;
    this.currentImageIndex.set(newIndex);
  }

  setImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-US');
  }

  formatMileage(mileage: number): string {
    return mileage.toLocaleString('en-US');
  }
}