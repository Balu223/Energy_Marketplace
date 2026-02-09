import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TradeRequestDto {
    productId: number;
    user_Id: number;
    quantity: number;
}

@Injectable({ providedIn: 'root' })
export class TradeService {
  private readonly baseUrl = 'http://localhost:5159/api';

    constructor(private http: HttpClient) {}

    executeTrade(tradeMode: string, tradeRequest: TradeRequestDto): Observable<any> {
        const url = `${this.baseUrl}/trade/${tradeMode}`;
        return this.http.post(url, tradeRequest);
    }
}