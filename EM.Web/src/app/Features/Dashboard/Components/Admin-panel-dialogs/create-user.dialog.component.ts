import { CommonModule } from "@angular/common";
import { Component, inject, Inject } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormBuilder } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { TradeService } from "../../../../Core/Services/trade.service";
import { CreateProfileDto, UpdateProfileDto, UserResponseDto, UserService } from "../../../../Core/Services/user.service";
import { TradeMode } from "../Trade-dialog/trade-dialog.component";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { UpdateProfileButtonComponent } from "../Userprofile/updateprofile-button.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AuthService } from "@auth0/auth0-angular";
import { AdminService } from "../../../../Core/Services/admin.service";
import { ConfirmDialogService } from "../../../../Core/Services/confirm.service";

@Component({
  selector: 'create-user-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatFormField, MatInputModule, ReactiveFormsModule, MatSnackBarModule, MatOption, UpdateProfileButtonComponent],
  template: `
  <form [formGroup]="form" class="create-user-dialog" ng-model="true">

  <h2>Create User</h2>

    <div class="form-fields-wrapper">

      <div class="input-fields-container">
        <mat-form-field>
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" type="text" />
        </mat-form-field>

          <mat-form-field >
    <mat-label>E-mail</mat-label>
    <input matInput PanelClass="disabled" formControlName="email" type="email" />
    </mat-form-field>

          <mat-form-field floatLabel="always">
    <mat-label>Address</mat-label>
    <input matInput formControlName="address" type="text" />
  </mat-form-field>

        <mat-form-field>
    <mat-label>Role</mat-label>
    <mat-select panelClass="role-select-panel" formControlName="role", type ="role">
      <mat-option value="Admin">Admin</mat-option>
      <mat-option value="Broker">Broker</mat-option>
      <mat-option value="User">User</mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
  <mat-label>Password</mat-label>
  <input matInput formControlName="password" type="password" />

  <mat-hint class="password-hint">
    Password must contain:
    <br>• min. 8 characters
    <br>• UPPERCASE letter
    <br>• number
    <br>• special char (*, -, .)
  </mat-hint>
</mat-form-field>

      </div>
    </div>

    <div class="buttons-container">
      <update-profile-button (save)="onSave()" mat-raised-button
              type="submit"
              color="primary"
      >Create</update-profile-button>

    </div>
</form>
  `
})
export class CreateUserDialogComponent {
onSave() {
if (this.form.invalid) return;

    const profile: CreateProfileDto = {
        username: this.form.value.username ?? '',
        password: this.form.value.password ?? '',
        email: this.form.value.email ?? '',
        address: this.form.value.address ?? '',
        role: this.form.value.role ?? '',
    };
    this.confirmDialog.confirm({
      title: 'Are you sure?',
      message: 'Do you want to create a new user?',
      confirmLabel: 'Create',
      cancelLabel: 'Cancel'
    
  }, {panelClass: 'confirm-dialog-panel'}).subscribe((confirmed: any) => {
    if (confirmed) {
    this.userService.createProfile(profile).subscribe(() => {
      console.log('Profile created successfully');
      this.dialogRef.close(true);
      this.adminService.getUsers();
    });
     }});
}
  form!: FormGroup;
  userdata$!: Observable<UserResponseDto>;
  userData: UserResponseDto | null = null;
  private router = inject(Router);

  constructor(

    private userService: UserService,               
    private fb: FormBuilder,
    private tradeService: TradeService,              
    private dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private adminService: AdminService,
    private confirmDialog: ConfirmDialogService,


    @Inject(MAT_DIALOG_DATA)
    public data: {
      username: string;
      password: string;
      email: number;
      address: string;
      role: number;
    }
  ) {
    this.userdata$ = this.userService.getMe();
    this.userdata$.subscribe(user => {
        this.userData = user;
    });
        this.form = this.fb.group({
      username: [''],
      password: [''],
      email: [''],
      address: [''],
      role: ['User']
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
}