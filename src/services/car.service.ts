
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Car {
  id?: number;
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
  imageUrls: string[] | string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly apiUrl = 'http://34.70.147.133:8061/public/cars';
  private cars = signal<Car[]>([]);
  private loading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadCars();
  }

  getAllCars = computed(() => this.cars());
  isLoading = computed(() => this.loading());

  async loadCars(): Promise<void> {
    try {
      this.loading.set(true);
      const response = await firstValueFrom(
        this.http.get<ApiResponse<{ data: Car[] }>>(this.apiUrl)
      );

      if (response.success && response.data.data) {
        // Parse imageUrls if it's a JSON string
        const cars = response.data.data.map(car => ({
          ...car,
          imageUrls: typeof car.imageUrls === 'string'
            ? JSON.parse(car.imageUrls)
            : car.imageUrls
        }));
        this.cars.set(cars);
      }
    } catch (error) {
      console.error('Error loading cars from API:', error);
      // Fallback to empty array or show error
      this.cars.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async getCarByRegNo(regNo: string): Promise<Car | undefined> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<Car>>(`${this.apiUrl}/regNo/${regNo}`)
      );

      if (response.success && response.data) {
        const car = response.data;
        // Parse imageUrls if it's a JSON string
        return {
          ...car,
          imageUrls: typeof car.imageUrls === 'string'
            ? JSON.parse(car.imageUrls)
            : car.imageUrls
        };
      }
      return undefined;
    } catch (error) {
      console.error('Error fetching car by regNo:', error);
      return undefined;
    }
  }

  // These methods update local state only - for full functionality,
  // they should call the protected API endpoints with authentication
  addCar(car: Car): void {
    this.cars.update(cars => [...cars, car]);
  }

  updateCar(updatedCar: Car): void {
    this.cars.update(cars =>
      cars.map(car => (car.registrationNo === updatedCar.registrationNo ? updatedCar : car))
    );
  }

  deleteCar(regNo: string): void {
    this.cars.update(cars => cars.filter(car => car.registrationNo !== regNo));
  }
}
