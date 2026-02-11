import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthModule } from '@auth0/auth0-angular';
import {
  UserResponseDto,
  UserService,
} from '../../../../Core/Services/user.service';
import {
  MarketplaceService,
  MarketplaceSummaryItem
} from '../../../../Core/Services/marketplace.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AuthModule,
  ],
  templateUrl: './admin-panel.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AdminPanelComponent implements OnInit {
  users$!: Observable<UserResponseDto[]>;
  items$!: Observable<MarketplaceSummaryItem[]>;

  // mindig létező form
  form!: FormGroup;
  adminService: any;
  constructor(
    private userService: UserService,
    private marketplaceService: MarketplaceService,
    private fb: FormBuilder
  ) {}

  get newPurchase() {
    return this.form.get('newPurchase') as FormArray<FormControl<number | null>>;
  }

  get newSale() {
    return this.form.get('newSale') as FormArray<FormControl<number | null>>;
  }

  ngOnInit(): void {
    this.users$ = this.userService.listUsers();
    this.items$ = this.marketplaceService.getSummary();
    this.form = this.fb.group({
      newPurchase: this.fb.array<FormControl<number | null>>([]),
      newSale: this.fb.array<FormControl<number | null>>([]),
    });

    this.items$.subscribe((items) => {
      const purchaseControls = items.map((i) =>
        this.fb.control(i.purchase_Price_Per_Unit ?? 0)
      );
      const saleControls = items.map((i) =>
        this.fb.control(i.sale_Price_Per_Unit ?? 0)
      );

      this.form.setControl(
        'newPurchase',
        this.fb.array(purchaseControls)
      );
      this.form.setControl(
        'newSale',
        this.fb.array(saleControls)
      );
    });
  }

  decrement(i: number) {
    const c = this.newPurchase.at(i);
    const current = c.value ?? 0;
    if (current > 0) c.setValue(current - 1);
  }

  increment(i: number) {
    const c = this.newPurchase.at(i);
    c.setValue((c.value ?? 0) + 1);
  }

  decrementSale(i: number) {
    const c = this.newSale.at(i);
    const current = c.value ?? 0;
    if (current > 0) c.setValue(current - 1);
  }

  incrementSale(i: number) {
    const c = this.newSale.at(i);
    c.setValue((c.value ?? 0) + 1);
  }

  updatePrice(item: MarketplaceSummaryItem, index: number) {
    const purchase = this.newPurchase.at(index).value;
    const sale = this.newSale.at(index).value;
    if (purchase == null || sale == null) return;
    const updatedItem: MarketplaceSummaryItem = {
      ...item,
      purchase_Price_Per_Unit: purchase || item.purchase_Price_Per_Unit,
      sale_Price_Per_Unit: sale || item.sale_Price_Per_Unit,
    };
    this.marketplaceService.UpdatePrice(updatedItem).subscribe(() => {
      console.log('Price updated successfully');
    });
  }

  editUser(user: UserResponseDto) { console.log('Edit user', user); }
  deleteUser(userId: number) { console.log('Delete user', userId); }
  deactivateUser(userId: number) { console.log('Deactivate user', userId); }
  createUser() { console.log('Create user'); }
}
