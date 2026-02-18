import { Component, DOCUMENT, Inject, inject } from '@angular/core';
import { AuthService, GenericError } from '@auth0/auth0-angular';
import { filter } from 'rxjs';

@Component({
  selector: 'app-login-button',
  standalone: true,
  template: `<button (click)="login()">Log in</button>`
})
export class LoginButtonComponent {
  constructor(public auth: AuthService, @Inject(DOCUMENT) doc: Document)
  {}
  ngOnInit(): void {
    this.auth.error$
      .pipe(
        filter((e): e is GenericError => e instanceof GenericError)
      )
      .subscribe((err) => {

        if (
          err.error === 'access_denied' &&
          err.error_description?.includes('deactivated')
        ) {
          alert('Your account has been deactivated. Please log in with a different account.');

          this.auth.logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          });
        }
      });
  }

  login() {
    this.auth.loginWithRedirect(
        { appState: { target: '/summary' } }
    );
  }
}