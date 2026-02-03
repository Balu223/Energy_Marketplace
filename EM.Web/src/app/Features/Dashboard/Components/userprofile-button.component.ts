import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'user-profile-button',
  standalone: true,
  template: `<button (click)="ChartRedirect()">Profile</button>`
})
export class UserProfileButtonComponent {
  constructor(private router: Router) {}

  ChartRedirect() {
    this.router.navigate(['/profile']);
  }
}
