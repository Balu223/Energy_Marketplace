import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Observable, tap, catchError, of } from 'rxjs';

interface MarketplaceSummaryItem {
  product_Id: number;
  quantity: number;
}

@Component({
  selector: 'app-root',
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
    responsive: true
  };

  data$!: Observable<MarketplaceSummaryItem[]>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.data$ = this.http
      .get<MarketplaceSummaryItem[]>('http://localhost:5159/api/marketplace/summary')
      .pipe(
        tap(d => {
          console.log('API data received:', d);

          const electricity = d.find(x => x.product_Id === 1)?.quantity ?? 0;
          const gas         = d.find(x => x.product_Id === 2)?.quantity ?? 0;
          const oil         = d.find(x => x.product_Id === 3)?.quantity ?? 0;

          this.barChartData = {
            labels: ['Electricity', 'Natural Gas', 'Crude Oil'],
              datasets: [
                {
                  data: [electricity, gas, oil],
                  label: 'Marketplace quantity',
                  backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
                }
              ]
            };


          this.loading = false;
          this.error = null;
        }),
        catchError(err => {
          console.error('API error:', err);
          this.loading = false;
          this.error = 'Hiba történt az adatok betöltésekor.';
          return of([] as MarketplaceSummaryItem[]);
        })
      );
    this.data$.subscribe();
  }
}
