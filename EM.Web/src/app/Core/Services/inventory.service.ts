import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InventorySummaryItem {
    product_Id: number;
    quantity: number;
    product_Name: string;
    price_Per_Unit: number;
    unit: string;
    
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly baseUrl = 'http://localhost:5159/api';

  constructor(private http: HttpClient) {}

  getInventory(): Observable<InventorySummaryItem[]> {
    return this.http.get<InventorySummaryItem[]>(`${this.baseUrl}/inventory`);
  }
  getGenerateMissingInventoryItems(): Observable<InventorySummaryItem[]> {
    return this.http.get<InventorySummaryItem[]>(`${this.baseUrl}/inventory/generate-missing`, {});
  }
}