import { Routes } from '@angular/router';
import { MarketplaceChartComponent } from './Features/Dashboard/Components/Marketplace-chart/marketplace-chart.component';
import { AppComponent } from './app.component';
import { authGuard } from './Core/Guards/auth.guard';
import { UserProfileComponent } from './Features/Dashboard/Components/Userprofile/userprofile.component';
import { UserInventoryComponent } from './Features/Dashboard/Components/User-inventory/user-inventory.component';
import { AdminPanelComponent } from './Features/Dashboard/Components/Admin-panel/admin-panel.component';

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
    {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'inventory',
    component: UserInventoryComponent,
    canActivate: [authGuard]
  },
    {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [authGuard]
  },
  
];