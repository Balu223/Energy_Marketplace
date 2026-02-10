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
import { UserInventoryButtonComponent } from "./Features/Dashboard/Components/User-inventory/user-inventory-button.component";
import { UserResponseDto, UserService } from './Core/Services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AsyncPipe, LoginButtonComponent, LogoutButtonComponent, MarketplaceChartButtonComponent, RouterOutlet, UserProfileButtonComponent, AuthModule, UserInventoryButtonComponent],
  template: `
    <div class="app-container">
      @if (auth.isLoading$ | async) {
        <div class="loading-state">Loading...</div>
      }

      @if (auth.error$ | async; as error) {
        <div class="error-state">
          <div>{{ error.message }}</div>
        </div>
      }

      <header class="main-header">
        <img
          src="/logo.png"
          alt="Energy Marketplace Logo"
          class="em-logo"
        />
        <h1 class="app-title">Main Marketplace</h1>
<div style="position: relative">
  <div class="header-actions">
    @if (auth.isAuthenticated$ | async) {
      <user-inventory-button></user-inventory-button>
      <marketplace-chart-button></marketplace-chart-button>
      <user-profile-button></user-profile-button>
      <app-logout-button />
    } @else {
      <app-login-button />
    }
  </div>
  @if (auth.isAuthenticated$ | async) {
  <div class="credits-card">
  <span class="credits-label">Credits</span>
  <span class="credits-value">{{ (userdata$ | async)?.credits }} HUF</span>
</div>}
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
        } @else if (isInventoryPage()) {
          <main class="page-content">
            <router-outlet></router-outlet>
          </main>
        }
        
        @else {
          <main class="page-content">
            @if (auth.isAuthenticated$ | async) {
              <div class="main-card-wrapper">
                <h1>Welcome, {{ (userdata$ | async)?.username }}!</h1>
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
  userdata$!: Observable<UserResponseDto | null>;
  protected readonly isSummaryPage = signal(false);
  protected readonly isProfilePage = signal(false);
  protected readonly isInventoryPage = signal(false);
  
  constructor(private userService: UserService) {
    this.router.events
      .pipe(filter((e: any) => e?.routerEvent?.url || e.url))
      .subscribe(() => {
        this.isSummaryPage.set(this.router.url.startsWith('/summary'));
        this.isProfilePage.set(this.router.url.startsWith('/profile'));
        this.isInventoryPage.set(this.router.url.startsWith('/inventory'));
      });
        this.userdata$ = this.userService.user$;
        this.userService.getMe().subscribe();

  }
}
