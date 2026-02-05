import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Car, CarService } from '../../services/car.service';

@Component({
  selector: 'app-enquiry-form',
  templateUrl: './enquiry-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private carService = inject(CarService);
  private router = inject(Router);

  car = signal<Car | undefined>(undefined);
  isSubmitting = signal(false);

  states = [
    'Johor', 'Kedah', 'Kelantan', 'Kuala Lumpur', 'Labuan', 'Melaka', 
    'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 
    'Putrajaya', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu'
  ];

  enquiryForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9-+\\s()]*$')]],
    state: ['', Validators.required],
    pdpa: [false, Validators.requiredTrue],
    marketing: [false]
  });

  ngOnInit(): void {
    const regNo = this.route.snapshot.paramMap.get('regNo');
    if (regNo) {
      this.car.set(this.carService.getCarByRegNo(regNo));
    }
  }

  onSubmit(): void {
    if (this.enquiryForm.invalid) {
      this.enquiryForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting.set(true);
    console.log('Enquiry submitted:', this.enquiryForm.value);

    // Simulate a short delay for API call to show loading state
    setTimeout(() => {
      const regNo = this.car()?.registrationNo;
      this.router.navigate(['/thank-you'], { queryParams: { regNo } });
    }, 500);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-US');
  }

  formatMileage(mileage: number): string {
    return mileage.toLocaleString('en-US');
  }
}
