import { Routes } from '@angular/router';
import { MarketplaceChartComponent } from './Features/Dashboard/Components/Marketplace-chart/marketplace-chart.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    component: MarketplaceChartComponent
  },
  // később:
  // { path: 'login', component: AuthLoginComponent },
  // { path: 'callback', component: AuthCallbackComponent },
];