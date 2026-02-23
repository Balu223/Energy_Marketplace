import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

declare var Stripe: any;

@Injectable({ providedIn: 'root' })
export class StripeService {
  private stripe = Stripe(environment.stripePublishableKey);

  constructor(private http: HttpClient) {}

  createPaymentIntent(credits: number): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(
      `${environment.apiUrl}/api/payments/create-payment-intent`,
      { credits }
    );
  }

  getStripe() {
    return this.stripe;
  }
}