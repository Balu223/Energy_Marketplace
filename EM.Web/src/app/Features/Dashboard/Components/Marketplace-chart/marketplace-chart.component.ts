import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Observable, tap, catchError, of } from 'rxjs';
import { MarketplaceService, MarketplaceSummaryItem } from '../../../../Core/Services/marketplace.service';


@Component({
  selector: 'app-marketplace-chart',
  standalone: true,
  templateUrl: './marketplace-chart.component.html',
  imports: [AsyncPipe, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MarketplaceChartComponent implements OnInit {
  loading = true;
  error: string | null = null;

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Electricity', 'Natural Gas', 'Crude Oil'],
    datasets: [
      { data: [1, 2, 3], label: 'Marketplace quantity' }
  ]
};


  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    hoverBackgroundColor: '#ca566f',
  };

  data$!: Observable<MarketplaceSummaryItem[]>;

  constructor(private marketplaceService: MarketplaceService) {}

  ngOnInit(): void {
  this.data$ = this.marketplaceService
    .getSummary()
    .pipe(
      tap(d => {
        const labels = d.map(x => `${x.product_Name} (${x.unit.toString()})`);
        const quantities = d.map(x => x.quantity);

        this.barChartData = {
          labels,
          datasets: [
            {
              data: quantities,
              label: 'Marketplace quantity',
              backgroundColor: ['#45a5f5', '#66BB6A', '#FFA726']
            }
          ]
        };

        this.loading = false;
        this.error = null;
      }),
      catchError(err => {
        console.error('API error:', err);
        this.loading = false;
        this.error = 'Error while fetching data.';
        return of([] as MarketplaceSummaryItem[]);
      })
    );

  this.data$.subscribe();
}

}
