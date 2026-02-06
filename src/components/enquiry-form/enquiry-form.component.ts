import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Car, CarService } from '../../services/car.service';
import { EnquiryService } from '../../services/enquiry.service';

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
  private enquiryService = inject(EnquiryService);
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

  async ngOnInit(): Promise<void> {
    const regNo = this.route.snapshot.paramMap.get('regNo');
    if (regNo) {
      const car = await this.carService.getCarByRegNo(regNo);
      if (car) {
        this.car.set(car);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.enquiryForm.invalid) {
      this.enquiryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formData = {
        name: this.enquiryForm.value.name!,
        email: this.enquiryForm.value.email!,
        phone: this.enquiryForm.value.phone!,
        state: this.enquiryForm.value.state!,
        pdpa: this.enquiryForm.value.pdpa!,
        marketing: this.enquiryForm.value.marketing!
      };

      const carId = this.car()?.id;
      await this.enquiryService.submitEnquiry(formData, carId);

      const regNo = this.car()?.registrationNo;
      this.router.navigate(['/thank-you'], { queryParams: { regNo } });
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
      this.isSubmitting.set(false);
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-US');
  }

  formatMileage(mileage: number): string {
    return mileage.toLocaleString('en-US');
  }
}
