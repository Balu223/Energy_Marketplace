import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-button',
  standalone: true,
  template: `<button (click)="login()">Log in</button>`
})
export class LoginButtonComponent {
  private auth = inject(AuthService);

  login() {
    this.auth.loginWithRedirect(
        { appState: { target: '/summary' } }
    );
  }
}