import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private carService = inject(CarService);
  // FIX: Explicitly type the injected Router to fix type inference issue.
  private router: Router = inject(Router);

  cars = this.carService.getAllCars;

  editCar(regNo: string): void {
    this.router.navigate(['/admin/edit', regNo]);
  }

  deleteCar(regNo: string, name: string): void {
    if (confirm(`Are you sure you want to delete the car: ${name} (${regNo})?`)) {
      this.carService.deleteCar(regNo);
    }
  }
}
