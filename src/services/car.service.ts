
import { Injectable, signal, computed } from '@angular/core';

export interface Car {
  name: string;
  price: number;
  year: number;
  registrationNo: string;
  location: string;
  status: 'Available' | 'Sold' | 'Booked';
  monthlyInstallment: number;
  color: string;
  transmission: 'Automatic' | 'Manual';
  mileage: number;
  bookingFee: number;
  remarks?: string;
  imageUrls: string[];
}

// FIX: Added the missing Benefit interface definition.
export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class CarService {
  private cars = signal<Car[]>([
    {
      name: 'MEGANE R.S 280',
      price: 130000,
      year: 2020,
      registrationNo: 'VFA397',
      location: 'Lot 92',
      status: 'Available',
      monthlyInstallment: 1425,
      color: 'Orange Tonic',
      transmission: 'Automatic',
      mileage: 62406,
      bookingFee: 500,
      remarks: 'The estimated monthly payments are based on a 3.5% interest rate.',
      imageUrls: [
        'https://picsum.photos/seed/megane-rs-1/800/600',
        'https://picsum.photos/seed/megane-rs-2/800/600',
        'https://picsum.photos/seed/megane-rs-3/800/600',
        'https://picsum.photos/seed/megane-rs-4/800/600'
      ],
    },
    {
      name: 'KOLEOS SIGNATURE',
      price: 79800,
      year: 2018,
      registrationNo: 'VDU6438',
      location: 'Petaling Jaya',
      status: 'Available',
      monthlyInstallment: 1064,
      color: 'Black Metallic',
      transmission: 'Automatic',
      mileage: 84713,
      bookingFee: 500,
      remarks: 'The estimated monthly payments are based on a 3.5% interest rate.',
       imageUrls: [
        'https://picsum.photos/seed/koleos-1/800/600',
        'https://picsum.photos/seed/koleos-2/800/600'
      ],
    },
     {
      name: 'CAPTUR TROPHY',
      price: 85500,
      year: 2021,
      registrationNo: 'VGE1121',
      location: 'Glenmarie',
      status: 'Available',
      monthlyInstallment: 950,
      color: 'Pearl White',
      transmission: 'Automatic',
      mileage: 31250,
      bookingFee: 500,
      remarks: 'The estimated monthly payments are based on a 3.5% interest rate.',
       imageUrls: [
        'https://picsum.photos/seed/captur-1/800/600',
        'https://picsum.photos/seed/captur-2/800/600',
        'https://picsum.photos/seed/captur-3/800/600'
      ],
    }
  ]);

  getAllCars = computed(() => this.cars());

  getCarByRegNo(regNo: string): Car | undefined {
    return this.cars().find(c => c.registrationNo === regNo);
  }

  // FIX: Implement addCar to add a new car to the signal.
  addCar(car: Car): void {
    this.cars.update(cars => [...cars, car]);
  }

  // FIX: Implement updateCar to update an existing car in the signal.
  updateCar(updatedCar: Car): void {
    this.cars.update(cars =>
      cars.map(car => (car.registrationNo === updatedCar.registrationNo ? updatedCar : car))
    );
  }

  // FIX: Implement deleteCar to remove a car from the signal by registration number.
  deleteCar(regNo: string): void {
    this.cars.update(cars => cars.filter(car => car.registrationNo !== regNo));
  }
}