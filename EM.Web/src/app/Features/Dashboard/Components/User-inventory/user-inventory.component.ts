import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ActiveElement, ChartConfiguration, ChartEvent } from 'chart.js';
import { Observable, tap, catchError, of } from 'rxjs';
import { MarketplaceService, MarketplaceSummaryItem } from '../../../../Core/Services/marketplace.service';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { TradeDialogComponent, TradeSelectDialogComponent } from '../Trade-dialog/trade-dialog.component';
import { UserResponseDto, UserService } from '../../../../Core/Services/user.service';
import { InventoryService, InventorySummaryItem } from '../../../../Core/Services/inventory.service';


@Component({
  selector: 'app-user-inventory',
  standalone: true,
  templateUrl: './user-inventory.component.html',
  imports: [AsyncPipe, BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserInventoryComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  loading = true;
  error: string | null = null;
    
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Electricity', 'Natural Gas', 'Crude Oil'],
    datasets: [
      { data: [0, 0, 0], label: 'Inventory quantity' }
  ]
};

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
  hoverBackgroundColor: '#ca566f',
  indexAxis: 'y',
  animation: {
    duration: 500,
    easing: 'easeOutQuart',
  },
  transitions: {
    active: {
      animation: {
        duration: 500,
        easing: 'easeOutQuart',
      }
    }
  },
  scales: {
    x: {
      min: 0,
    }
  }
};

  data$!: Observable<MarketplaceSummaryItem[]>;
  inventoryData$!: Observable<InventorySummaryItem[]>;
  private items: MarketplaceSummaryItem[] = [];
  private currentXMax = 10;

  constructor(private marketplaceService: MarketplaceService, private inventoryService: InventoryService, private dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
  this.inventoryData$ = this.inventoryService
    .getGenerateMissingInventoryItems()
    .pipe(
      tap(d => {
        const sorted = [...d].sort((a, b) => a.product_Id - b.product_Id);
        this.items = sorted;

        const labels = sorted.map(x => `${x.product_Name} (${x.unit.toString()})`);
        const quantities = sorted.map(x => x.quantity);
        this.barChartData.labels = labels;

        if (this.barChartData.datasets[0]) {
          this.barChartData.datasets[0].data = quantities;
          this.barChartData.datasets[0].label = 'Inventory quantity';
          this.barChartData.datasets[0].backgroundColor = ['#45a5f5', '#66BB6A', '#FFA726'];
        } else {
          this.barChartData.datasets = [
            {
              data: quantities,
              label: 'Inventory quantity',
              backgroundColor: ['#45a5f5', '#66BB6A', '#FFA726']
            }
          ];
        }

const maxQuantity = quantities.length ? Math.max(...quantities) : 0;
const minMax = 10;

const opts = this.barChartOptions!;
opts.scales = opts.scales || {};
opts.scales['x'] = opts.scales['x'] || {};
const xScale = opts.scales['x']!;

const targetMax = Math.max(minMax, maxQuantity + 5);

const prevSuggestedMax = (xScale as any).suggestedMax ?? this.currentXMax;
const scaleChanged = prevSuggestedMax !== targetMax;

this.currentXMax = targetMax;

(xScale as any).suggestedMin = 0;
(xScale as any).suggestedMax = targetMax;


if (scaleChanged) {
  this.chart?.update('none'); 
} else {
  this.chart?.update();
}

        this.loading = false;
        this.error = null;
      }),
      catchError(err => {
        console.error('API error:', err);
        this.loading = false;
        this.error = 'Error while fetching data.';
        return of([] as InventorySummaryItem[]);
      })
    );

  this.inventoryData$.subscribe();
  this.data$ = this.marketplaceService.getSummary();
}
  onClick(item: InventorySummaryItem): void {

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
      data: item,
      panelClass: 'trade-select-panel'
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.loadData();

        this.userService.getMe().subscribe();
      }
    });
  }
}