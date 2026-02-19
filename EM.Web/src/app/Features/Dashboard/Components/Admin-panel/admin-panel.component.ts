import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
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
  CreateProfileDto
} from '../../../../Core/Services/user.service';
import {
  MarketplaceService,
  MarketplaceSummaryItem
} from '../../../../Core/Services/marketplace.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { EditUserDialogComponent } from '../Admin-panel-dialogs/edit-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from '../Admin-panel-dialogs/create-user.dialog.component';

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
  private usersSubject = new BehaviorSubject<UserResponseDto[]>([]);
  users$ = this.usersSubject.asObservable();
  items$!: Observable<MarketplaceSummaryItem[]>;
  currentUser$!: Observable<UserResponseDto>;
  isUsersOpen = false;
  isUsersClosing = false;



  private fb = inject(FormBuilder)

  form = this.fb.group({
      username: new FormControl<string | null>({value: '', disabled: true}),
      email: new FormControl<string | null>({value: '', disabled: true}),
      address: new FormControl<string | null>(''),
      role: new FormControl<string | null>({value: '', disabled: true}),
      newPurchase: this.fb.array<FormControl<number | null>>([]),
      newSale: this.fb.array<FormControl<number | null>>([]),
    });
  adminService: any;

  constructor(
    private userService: UserService,
    private marketplaceService: MarketplaceService,
    private dialog: MatDialog
  ) {}

  get newPurchase() {
    return this.form.get('newPurchase') as unknown as FormArray<FormControl<number | null>>;
  }

  get newSale() {
    return this.form.get('newSale') as unknown as FormArray<FormControl<number | null>>;
  }

  ngOnInit(): void {
   this.loadUsers();
    this.items$ = this.marketplaceService.getSummary();
    this.currentUser$ = this.userService.getMe();
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

loadUsers() {
    this.userService.listUsers()
      .pipe(
        map(users => [...users].sort((a, b) => a.user_Id - b.user_Id))
      )
      .subscribe(users => this.usersSubject.next(users));
}
toggleUsers() {
  if (this.isUsersOpen) {
    // 1) már nem "nyitott", de még látszik → closing állapot
    this.isUsersOpen = false;
    this.isUsersClosing = true;

    // 2) megvárjuk, amíg a closing anim lefut, aztán eltüntetjük teljesen
    setTimeout(() => {
      this.isUsersClosing = false; // ekkor esik ki a DOM-ból az @if miatt
    }, 250); // Ugyanannyi, mint a CSS animáció hossza
  } else {
    // nyitás
    this.isUsersOpen = true;
    this.isUsersClosing = false;
  }
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
    this.marketplaceService.getSummary();
    });
  }
    openUserEdit(item: UserResponseDto) {
      const dialogRef = this.dialog.open(EditUserDialogComponent, {
        data: item,      panelClass: 'edit-user-dialog-panel'
      },
      );
      dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.loadUsers();

        this.userService.getMe().subscribe();
      }
    });
    }

    openUserCreate() {
      const dialogRef = this.dialog.open(CreateUserDialogComponent, {panelClass: 'create-user-dialog-panel'},);
      dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.loadUsers();

        this.userService.getMe().subscribe();
      }
    });
    }

  editUser(user: UserResponseDto) { console.log('Edit user', user); }
  deleteUser(userid: number) 
  {
    this.userService.deleteProfile(userid).subscribe(() => {
      this.loadUsers();
      this.userService.getMe().subscribe();
    });
  }
  deactivateUser(userId: number) {
    this.userService.deactivateProfile(userId).subscribe(() => {
      this.loadUsers();
      this.userService.getMe().subscribe();
    });
  }
  activateUser(userId: number) {
    this.userService.activateProfile(userId).subscribe(() => {
      this.loadUsers();
      this.userService.getMe().subscribe();
    });
  }
  createUser() { console.log('Create user'); }
}
