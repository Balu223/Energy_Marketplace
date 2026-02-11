import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfileDto } from '../../Models/userprofile.dto';
import { UserResponseDto } from './user.service';

/* export interface InventorySummaryItem {
    product_Id: number;
    quantity: number;
    product_Name: string;
    price_Per_Unit: number;
    unit: string;
    
}
*/
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = 'http://localhost:5159/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(`${this.baseUrl}/admin/users`);
  }
}