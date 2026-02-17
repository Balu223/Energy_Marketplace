import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MarketplaceSummaryItem } from '../../../../Core/Services/marketplace.service';
import { MatFormField, MatInputModule, MatLabel } from "@angular/material/input";
import { FormBuilder, FormControl, FormGroup, NumberValueAccessor, ReactiveFormsModule } from '@angular/forms';
import { UserResponseDto, UserService } from '../../../../Core/Services/user.service';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { TradeRequestDto, TradeService } from '../../../../Core/Services/trade.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

export type TradeMode = 'buy' | 'sell';

@Component({
  selector: 'trade-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormField, MatInputModule, ReactiveFormsModule, MatSnackBarModule, MatIcon],
  template: `
  <form [formGroup]="form" class="trade-dialog">

  <h2>{{ data.mode === 'buy' ? 'Buy' : 'Sell' }} {{ data.productName }}</h2>

  <p><strong>Product:</strong> {{ data.productName }}</p>

  <div class="trade-row">
    <span class="trade-label"><strong>Quantity:</strong></span>
    <mat-form-field class="qty-field">
  <button mat-icon-button matPrefix type="button" (click)="decrement()">
    <mat-icon>remove</mat-icon>
  </button>

  <input
    matInput class="quantity-input no-spinner no-outline" formControlName="quantity" type="number" appearance="none" (input)="checkValue($event)" />

  <button mat-icon-button matSuffix type="button" (click)="increment()">
    <mat-icon>add</mat-icon>
  </button>
</mat-form-field>
  </div>

  <div class="price-info">
    <p><strong>Price:</strong> {{ data[data.mode === 'buy' ? 'purchasePricePerUnit' : 'salePricePerUnit'] }} HUF / {{ data.unit }}</p>
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
  userdata$!: Observable<UserResponseDto>;
  userData: UserResponseDto | null = null;
  private router = inject(Router);

  constructor(

    private userService: UserService,               
    private fb: FormBuilder,
    private tradeService: TradeService,              
    private dialogRef: MatDialogRef<TradeDialogComponent>,
    private snackbar: MatSnackBar,


    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: TradeMode;
      productName: string;
      quantity: number;
      unit: string;
      purchasePricePerUnit: number;
      salePricePerUnit: number;
      availableQuantity: number;
      productId: number;
    }
  ) {
    this.form = this.fb.group({
      quantity: [this.data.quantity ?? 0]
    });
    this.userdata$ = this.userService.getMe();
    this.userdata$.subscribe(user => {
      this.userData = user;
    });
  }
  private showSuccess(message: string) {
    this.snackbar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }
  private showError(message: string) {
    this.snackbar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
  }
  get totalPrice(): number {
    const qty = this.form.get('quantity')?.value ?? 0;
    return qty * this.data[this.data.mode === 'buy' ? 'purchasePricePerUnit' : 'salePricePerUnit'];
  }

  close() {
    this.dialogRef.close(false);
  }

  checkValue(event: any) {
    if (event.target.value < 0) {
      event.target.value = 0;
      this.form.get('quantity')?.setValue(0);
    }
  }
  increment() {
  const control = this.form.get('quantity');
  const current = Number(control?.value ?? 0);
  control?.setValue(current + 1);
}

decrement() {
  const control = this.form.get('quantity');
  const current = Number(control?.value ?? 0);
  if (current > 0) {
    control?.setValue(current - 1);
  }
}

  confirmTrade() {
    const quantity = this.form.get('quantity')?.value ?? 0;
    if (quantity <= 0) {
      this.showError('Quantity must be greater than zero.');
      return;
    }
    if (this.userData && this.userData.credits < this.totalPrice && this.data.mode === 'buy') {
      this.showError('You do not have enough credits to complete this purchase.');
      return;
    }
    
    if (quantity > this.data.availableQuantity / 4 && this.data.mode === 'buy' && !this.router.url.startsWith('/inventory')) {
      this.showError('You cannot trade more than a quarter of the available quantity.');
      return;
    }
    if (quantity > this.data.availableQuantity * 2 && this.data.mode === 'sell') {
      this.showError('You cannot sell more than double the available quantity.');
      return;
    }
    if (quantity > this.data.availableQuantity && this.data.mode === 'buy') {
      this.showError('You cannot buy more than the available quantity.');
      return;
    }
    if (quantity > this.data.availableQuantity && this.data.mode === 'sell') {
      this.showError('You cannot sell more than the available quantity.');
      return;
    }
    const tradeRequest: TradeRequestDto = {
      user_Id: this.userData ? this.userData.user_Id : 0,
      productId: this.data.productId,
      quantity
    };

    this.tradeService.executeTrade(this.data.mode, tradeRequest).subscribe({
      next: () => {
        this.userService.getMe().subscribe();
        this.showSuccess(`${this.data.mode === 'buy' ? 'Purchase' : 'Sale'} successful!`);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.showError(`Error executing ${this.data.mode === 'buy' ? 'purchase' : 'sale'}: ${error.message}`);
      }
    });
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

  constructor(
    private dialog: MatDialog, 
    @Inject(MAT_DIALOG_DATA) public marketplaceSummaryItem: MarketplaceSummaryItem, 
    private dialogRef: MatDialogRef<TradeSelectDialogComponent>) {}

  open(mode: TradeMode) {
    const innerRef =this.dialog.open(TradeDialogComponent, {
      data: {
        mode,
        productName: this.marketplaceSummaryItem.product_Name,
        quantity: 0,
        unit: this.marketplaceSummaryItem.unit,
        purchasePricePerUnit: this.marketplaceSummaryItem.purchase_Price_Per_Unit,
        salePricePerUnit: this.marketplaceSummaryItem.sale_Price_Per_Unit,
        availableQuantity: this.marketplaceSummaryItem.quantity,
        productId: this.marketplaceSummaryItem.product_Id
      },
      panelClass: 'trade-dialog-panel'
    });
    innerRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.dialogRef.close(true);
      }
    });
  }
}

