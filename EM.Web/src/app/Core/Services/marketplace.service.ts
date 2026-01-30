import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MarketplaceSummaryItem {
    product_Id: number;
    quantity: number;
    product_Name: string;
    price_Per_Unit: number;
    unit: string;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private readonly baseUrl = 'http://localhost:5159/api/marketplace';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<MarketplaceSummaryItem[]> {
    return this.http.get<MarketplaceSummaryItem[]>(`${this.baseUrl}/summary`);
  }
}
