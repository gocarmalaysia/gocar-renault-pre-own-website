import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Car, CarService } from '../../services/car.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankYouComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private carService = inject(CarService);

  car = signal<Car | undefined>(undefined);

  ngOnInit(): void {
    const regNo = this.route.snapshot.queryParamMap.get('regNo');
    if (regNo) {
      this.car.set(this.carService.getCarByRegNo(regNo));
    }
  }
}
