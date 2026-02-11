import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'admin-panel-button',
  standalone: true,
  template: `<button (click)="ChartRedirect()">Admin Panel</button>`
})
export class AdminPanelButtonComponent {
  constructor(private router: Router) {}

  ChartRedirect() {
    this.router.navigate(['/admin']);
  }
}