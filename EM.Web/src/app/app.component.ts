import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthModule, AuthService } from '@auth0/auth0-angular';
import { LoginButtonComponent } from './Features/Auth/Login/auth-login.component';
import { LogoutButtonComponent } from './Features/Auth/Login/auth-logout.component';
import { MarketplaceChartComponent } from './Features/Dashboard/Components/Marketplace-chart/marketplace-chart.component';
import { MarketplaceChartButtonComponent } from "./Features/Dashboard/Components/Marketplace-chart/marketplace-chart-button.component";
import { filter } from 'rxjs/internal/operators/filter';
import { UserProfileButtonComponent } from "./Features/Dashboard/Components/Userprofile/userprofile-button.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AsyncPipe, LoginButtonComponent, LogoutButtonComponent, MarketplaceChartButtonComponent, RouterOutlet, UserProfileButtonComponent, AuthModule],
  template: `
    <div class="app-container">
      @if (auth.isLoading$ | async) {
        <div class="loading-state">Loading...</div>
      }

      @if (auth.error$ | async; as error) {
        <div class="error-state">
          <div>Oops!</div>
          <div>{{ error.message }}</div>
        </div>
      }

      <header class="main-header">
        <img
          src="https://cdn.auth0.com/quantum-assets/dist/latest/logos/auth0/auth0-lockup-en-ondark.png"
          alt="Auth0 Logo"
          class="auth0-logo"
        />

        <div class="header-actions">
          @if (auth.isAuthenticated$ | async) {
            <marketplace-chart-button></marketplace-chart-button>
            <user-profile-button></user-profile-button>
            <app-logout-button />
          } @else {
            <app-login-button />
          }
        </div>
      </header>

      @if (!(auth.isLoading$ | async) && !(auth.error$ | async)) {
        @if (isSummaryPage()) {
          <main class="page-content">
            <router-outlet></router-outlet>
          </main>
        } @else if (isProfilePage()) {
          <main class="page-content">
            <router-outlet></router-outlet>
          </main>
        }
        
        @else {
          <main class="page-content">
            @if (auth.isAuthenticated$ | async) {
              <div class="main-card-wrapper">
                <h1>Welcome to Energy Marketplace</h1>
                <p>Successfully logged in.</p>
              </div>
            } @else {
              <div class="main-card-wrapper">
                <h1>Welcome to Energy Marketplace!</h1>
                <p>Create an account or log in to start trading.</p>
              </div>
            }
          </main>
        }
      }
    </div>
  `,
  styles: []
})
export class AppComponent {
  protected auth = inject(AuthService);
  private router = inject(Router);

  protected readonly isSummaryPage = signal(false);
  protected readonly isProfilePage = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((e: any) => e?.routerEvent?.url || e.url))
      .subscribe(() => {
        this.isSummaryPage.set(this.router.url.startsWith('/summary'));
        this.isProfilePage.set(this.router.url.startsWith('/profile'));
      });
  }
}
