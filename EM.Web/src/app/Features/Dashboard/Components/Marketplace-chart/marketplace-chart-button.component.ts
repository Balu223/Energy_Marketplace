import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'marketplace-chart-button',
  standalone: true,
  template: `<button (click)="ChartRedirect()">Dashboard</button>`
})
export class MarketplaceChartButtonComponent {
  constructor(private router: Router) {}

  ChartRedirect() {
    this.router.navigate(['/summary']);
  }
}

