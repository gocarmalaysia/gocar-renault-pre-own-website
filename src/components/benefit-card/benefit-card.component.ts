import { ChangeDetectionStrategy, Component, input } from '@angular/core';
// FIX: Corrected the import path for the Benefit interface.
import { Benefit } from '../../services/car.service';

@Component({
  selector: 'app-benefit-card',
  templateUrl: './benefit-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BenefitCardComponent {
  benefit = input.required<Benefit>();
}