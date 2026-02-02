import { Routes } from '@angular/router';
import { MarketplaceChartComponent } from './Features/Dashboard/Components/Marketplace-chart/marketplace-chart.component';
import { AppComponent } from './app.component';

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
    component: MarketplaceChartComponent
  },
  // később:
  // { path: 'login', component: AuthLoginComponent },
  // { path: 'callback', component: AuthCallbackComponent },
];