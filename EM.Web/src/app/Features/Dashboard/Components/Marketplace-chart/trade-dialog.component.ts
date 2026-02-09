import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MarketplaceSummaryItem } from '../../../../Core/Services/marketplace.service';
import { MatFormField, MatInputModule, MatLabel } from "@angular/material/input";
import { FormBuilder, FormGroup, NumberValueAccessor, ReactiveFormsModule } from '@angular/forms';

export type TradeMode = 'buy' | 'sell';

@Component({
  selector: 'trade-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormField, MatInputModule, ReactiveFormsModule],
  template: `
  <form [formGroup]="form" class="trade-dialog">

  <h2>{{ data.mode === 'buy' ? 'Buy' : 'Sell' }} {{ data.productName }}</h2>

  <p><strong>Product:</strong> {{ data.productName }}</p>

  <div class="trade-row">
    <span class="trade-label">Quantity:</span>

    <mat-form-field class="trade-input-field">
      <input matInput formControlName="quantity" type="number" />
    </mat-form-field>
  </div>

  <div class="price-info">
    <p><strong>Price:</strong> {{ data.pricePerUnit }} HUF / {{ data.unit }}</p>
  </div>

  <div class="price-info">
    <p><strong>Total:</strong> {{ totalPrice | number:'1.0-0' }} HUF</p>
  </div>

  <button mat-button (click)="close()">Cancel</button>
  <button mat-button (click)="confirmTrade()">{{ data.mode === 'buy' ? 'Confirm Purchase' : 'Confirm Sale' }}</button>
</form>
  `
})
export class TradeDialogComponent {
  form: FormGroup;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: TradeMode; productName: string; quantity: number; unit: string; pricePerUnit: number }
  ) {
        this.form = this.fb.group({
      quantity: [this.data.quantity ?? 0]
    });
  }
    get totalPrice(): number {
  const qty = this.form.get('quantity')?.value ?? 0;
  return qty * this.data.pricePerUnit;
}

  close() {
    this.dialog.closeAll();
  } 
  checkValue(event : any) {
    if (event.target.value < 0) {
      event.target.value = 0;
    }
  }
  confirmTrade() {
    const quantity = this.form.get('quantity')?.value ?? 0;
    if (quantity <= 0) {
      alert('Quantity must be greater than zero.');
      return;
    }
    // Here you would typically call a service to execute the trade
    alert(`${this.data.mode === 'buy' ? 'Purchased' : 'Sold'} ${quantity} ${this.data.unit} of ${this.data.productName} for a total of ${this.totalPrice} HUF.`);
    this.close();
  }
}


@Component({
  selector: 'trade-select-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div mat-dialog-actions class="trade-select-actions">
  <button mat-raised-button color="primary"
        class="trade-select-button trade-buy"
        (click)="open('buy')">
  Buy
</button>

<button mat-raised-button color="warn"
        class="trade-select-button trade-sell"
        (click)="open('sell')">
  Sell
</button>
</div>
  `
})
export class TradeSelectDialogComponent {
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public marketplaceSummaryItem: MarketplaceSummaryItem) {}

  open(mode: TradeMode) {
    this.dialog.open(TradeDialogComponent, {
      data: {
        mode,
        productName: this.marketplaceSummaryItem.product_Name,
        quantity: 0,
        unit: this.marketplaceSummaryItem.unit,
        pricePerUnit: this.marketplaceSummaryItem.price_Per_Unit
      },
      panelClass: 'trade-dialog-panel'
    });
  }
}



function confirmTrade() {
  throw new Error('Function not implemented.');
}

