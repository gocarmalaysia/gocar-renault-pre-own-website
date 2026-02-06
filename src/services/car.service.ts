
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

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
  private readonly apiUrl = `${environment.apiUrl}${environment.apiPrefix}/cars`;
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

  async getFilteredCars(filters: {
    status?: string;
    model?: string;
    location?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ cars: Car[]; total: number }> {
    try {
      this.loading.set(true);

      // Build query parameters
      const params: any = {};
      if (filters.status && filters.status !== 'All') params.status = filters.status;
      if (filters.model && filters.model !== 'All') params.name = filters.model;
      if (filters.location && filters.location !== 'All') params.location = filters.location;
      if (filters.sortBy && filters.sortBy !== 'Default') {
        // Map sort options to API format
        switch (filters.sortBy) {
          case 'Price: Low to High':
            params.sortBy = 'price';
            params.sortOrder = 'asc';
            break;
          case 'Price: High to Low':
            params.sortBy = 'price';
            params.sortOrder = 'desc';
            break;
          case 'Year: Newest':
            params.sortBy = 'year';
            params.sortOrder = 'desc';
            break;
        }
      }
      if (filters.page !== undefined) params.page = filters.page;
      if (filters.limit !== undefined) params.limit = filters.limit;

      const response = await firstValueFrom(
        this.http.get<ApiResponse<{ data: Car[]; total?: number }>>(this.apiUrl, { params })
      );

      if (response.success && response.data.data) {
        // Parse imageUrls if it's a JSON string
        const cars = response.data.data.map(car => ({
          ...car,
          imageUrls: typeof car.imageUrls === 'string'
            ? JSON.parse(car.imageUrls)
            : car.imageUrls
        }));
        return {
          cars,
          total: response.data.total || cars.length
        };
      }
      return { cars: [], total: 0 };
    } catch (error) {
      console.error('Error loading filtered cars from API:', error);
      return { cars: [], total: 0 };
    } finally {
      this.loading.set(false);
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
