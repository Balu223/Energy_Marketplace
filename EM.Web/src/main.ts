import { bootstrapApplication } from '@angular/platform-browser';
import { MarketplaceChartComponent } from './app/marketplace-chart.component';
import { provideHttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

providers: [
  provideCharts(withDefaultRegisterables())
]


bootstrapApplication(MarketplaceChartComponent, {
  providers: [provideHttpClient(), JsonPipe, AsyncPipe, provideCharts(withDefaultRegisterables())]
})
  .catch((err) => console.error(err));