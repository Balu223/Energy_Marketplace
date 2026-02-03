import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  template: `<button (click)="logout()">Log out</button>`
})
export class LogoutButtonComponent {
  private auth = inject(AuthService);

  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}