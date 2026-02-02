import { Routes } from '@angular/router';
import { MarketplaceChartComponent } from './Features/Dashboard/Components/Marketplace-chart/marketplace-chart.component';
import { AppComponent } from './app.component';
import { authGuard } from './Core/Guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: AppComponent
  },
  {
    path: 'summary',
    component: MarketplaceChartComponent,
    canActivate: [authGuard]
  },
  // később:
  // { path: 'login', component: AuthLoginComponent },
  // { path: 'callback', component: AuthCallbackComponent },
];