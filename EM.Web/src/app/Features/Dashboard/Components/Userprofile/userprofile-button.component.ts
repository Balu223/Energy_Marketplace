import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DebugTokenService } from '../../../../Core/Services/user.service';

@Component({
  selector: 'user-profile-button',
  standalone: true,
  template: `<button (click)="ChartRedirect()">Profile</button>`
})
export class UserProfileButtonComponent {
  constructor(private router: Router, private debugToken: DebugTokenService) {}

  ChartRedirect() {
    this.router.navigate(['/profile']);
  }

ngOnInit() {
  this.debugToken.logAccessToken();

}
}
