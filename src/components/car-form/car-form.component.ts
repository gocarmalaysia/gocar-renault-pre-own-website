import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Car, CarService } from '../../services/car.service';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarFormComponent implements OnInit {
  // FIX: Explicitly type injected services to resolve type inference issues.
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private carService = inject(CarService);

  carForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
    registrationNo: ['', Validators.required],
    location: ['', Validators.required],
    status: ['Available', Validators.required],
    monthlyInstallment: [0, [Validators.required, Validators.min(0)]],
    color: ['', Validators.required],
    transmission: ['Automatic', Validators.required],
    mileage: [0, [Validators.required, Validators.min(0)]],
    bookingFee: [0, [Validators.required, Validators.min(0)]],
    remarks: [''],
    imageUrls: ['', Validators.required],
  });

  isEditMode = false;
  private currentRegNo: string | null = null;

  ngOnInit(): void {
    this.currentRegNo = this.route.snapshot.paramMap.get('regNo');
    if (this.currentRegNo) {
      this.isEditMode = true;
      this.carForm.controls.registrationNo.disable();
      const existingCar = this.carService.getCarByRegNo(this.currentRegNo);
      if (existingCar) {
        const carData = { ...existingCar, imageUrls: existingCar.imageUrls.join(', ') };
        this.carForm.patchValue(carData);
      }
    }
  }

  onSubmit(): void {
    if (this.carForm.invalid) {
      return;
    }

    const formValue = this.carForm.getRawValue();
    const carData: Car = {
      ...formValue,
      imageUrls: formValue.imageUrls!.split(',').map(url => url.trim()),
    } as Car;


    if (this.isEditMode && this.currentRegNo) {
      this.carService.updateCar({ ...carData, registrationNo: this.currentRegNo });
    } else {
      if (this.carService.getCarByRegNo(carData.registrationNo)) {
        this.carForm.controls.registrationNo.setErrors({ 'notUnique': true });
        return;
      }
      this.carService.addCar(carData);
    }

    this.router.navigate(['/admin']);
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}
