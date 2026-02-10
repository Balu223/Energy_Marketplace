import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'user-inventory-button',
  standalone: true,
  template: `<button (click)="ChartRedirect()">Inventory</button>`
})
export class UserInventoryButtonComponent {
  constructor(private router: Router) {}

  ChartRedirect() {
    this.router.navigate(['/inventory']);
  }
}