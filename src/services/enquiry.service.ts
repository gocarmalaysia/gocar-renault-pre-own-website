import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

export interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  state: string;
  pdpa: boolean;
  marketing: boolean;
  carId?: number;
  registrationNo?: string;
}

export interface EnquiryRequest {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  pdpaConsent: boolean;
  marketingConsent: boolean;
  carId?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class EnquiryService {
  private readonly apiUrl = `${environment.apiUrl}${environment.apiPrefix}/enquiry`;

  constructor(private http: HttpClient) {}

  async submitEnquiry(formData: EnquiryFormData, carId?: number): Promise<any> {
    try {
      const enquiryData: EnquiryRequest = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        pdpaConsent: formData.pdpa,
        marketingConsent: formData.marketing,
      };

      if (carId) {
        enquiryData.carId = carId;
      }

      const response = await firstValueFrom(
        this.http.post<ApiResponse<any>>(this.apiUrl, enquiryData)
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      throw error;
    }
  }
}
