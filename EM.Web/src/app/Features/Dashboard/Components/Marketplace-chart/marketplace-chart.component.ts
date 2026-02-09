import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ActiveElement, ChartConfiguration, ChartEvent } from 'chart.js';
import { Observable, tap, catchError, of } from 'rxjs';
import { MarketplaceService, MarketplaceSummaryItem } from '../../../../Core/Services/marketplace.service';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { TradeDialogComponent, TradeSelectDialogComponent } from '../Trade-dialog/trade-dialog.component';
import { UserResponseDto, UserService } from '../../../../Core/Services/user.service';


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
  private items: MarketplaceSummaryItem[] = [];

  constructor(private marketplaceService: MarketplaceService, private dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.data$ = this.marketplaceService
      .getSummary()
      .pipe(
        tap(d => {
          const sorted = [...d].sort((a, b) => a.product_Id - b.product_Id);
          this.items = sorted;

          const labels = sorted.map(x => `${x.product_Name} (${x.unit.toString()})`);
          const quantities = sorted.map(x => x.quantity);

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
  onClick(item: MarketplaceSummaryItem): void {

    this.openTradeSelect(item);
  }
  onChartClick(active: object[] | undefined): void {
    if (!active || active.length === 0) {
      return;
    }

    const firstPoint: any = active[0];
    const index = firstPoint.index;

    const item = this.items[index];
    if (!item) {
      return;
    }

    this.openTradeSelect(item);
  }
openTrade(event: any) {
  let position: DialogPosition = {left: event.clientX + 'px', top: event.clientY + 'px'};
  this.dialog.closeAll();
  this.dialog.open(TradeSelectDialogComponent, { position });
}
  openTradeSelect(item: MarketplaceSummaryItem) {
    const dialogRef = this.dialog.open(TradeSelectDialogComponent, {
      data: item
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.loadData();

        this.userService.getMe().subscribe();
      }
    });
  }


}
