import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MarketplaceSummaryItem {
    product_Id: number;
    quantity: number;
    product_Name: string;
    purchase_Price_Per_Unit: number;
    sale_Price_Per_Unit: number;
    unit: string;
    
}
export interface UpdatePriceDto {
  product_Id: number;
  purchase_Price_Per_Unit: number;
  sale_Price_Per_Unit: number;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private readonly baseUrl = 'http://localhost:5159/api';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<MarketplaceSummaryItem[]> {
    return this.http.get<MarketplaceSummaryItem[]>(`${this.baseUrl}/marketplace/summary`);
  }
    UpdatePrice(dto: MarketplaceSummaryItem): Observable<MarketplaceSummaryItem> {
    return this.http.put<MarketplaceSummaryItem>(`${this.baseUrl}/admin/update-price`, dto);
  }
}
