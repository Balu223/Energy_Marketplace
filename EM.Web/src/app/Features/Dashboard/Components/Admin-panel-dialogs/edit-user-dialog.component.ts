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
import { UpdateProfileDto, UserResponseDto, UserService } from "../../../../Core/Services/user.service";
import { TradeMode } from "../Trade-dialog/trade-dialog.component";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { UpdateProfileButtonComponent } from "../Userprofile/updateprofile-button.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: 'edit-user-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatFormField, MatInputModule, ReactiveFormsModule, MatSnackBarModule, MatOption, UpdateProfileButtonComponent],
  template: `
  <form [formGroup]="form" class="edit-user-dialog" (ngSubmit)="onSave()" ng-model="true">

  <h2>Edit {{ data.username }}'s profile</h2>

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
    <mat-label>Credits</mat-label>
    <input matInput formControlName="credits" type="number" />
  </mat-form-field>
      </div>
    </div>

    <div class="buttons-container">
      <update-profile-button (save)="onSave()" mat-raised-button
              type="submit"
              color="primary"
      >Save</update-profile-button>

    </div>
</form>
  `
})
export class EditUserDialogComponent {
onSave() {
if (this.form.invalid) return;

    const updatedProfile: UpdateProfileDto = {
        user_Id: this.data?.user_Id,
        username: this.form.value.username ?? '',
        email: this.form.value.email ?? '',
        address: this.form.value.address ?? '',
        role: this.form.value.role ?? '',
        credits: this.data?.credits ?? 0
    };
    this.userService.updateProfile(updatedProfile).subscribe(() => {
      console.log('Profile updated successfully');
      if (this.data.user_Id == this.userData?.user_Id)
      {
        this.auth.logout({logoutParams: {returnTo: window.location.origin}});
      }
      this.dialogRef.close(true);
    });
}
  form!: FormGroup;
  userdata$!: Observable<UserResponseDto>;
  userData: UserResponseDto | null = null;
  private router = inject(Router);

  constructor(
    private userService: UserService,               
    private fb: FormBuilder,
    private tradeService: TradeService,              
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,


    @Inject(MAT_DIALOG_DATA)
    public data: {
      user_Id: number;
      username: string;
      email: number;
      address: string;
      role: number;
      credits: number;
    }
  ) {
    this.userdata$ = this.userService.getMe();
    this.userdata$.subscribe(user => {
        this.userData = user;
    });
    this.form = this.fb.group({
        username: data.username ?? '',
        email: data.email ?? '',
        address : data.address,
        role : data.role,
        credits : data.credits
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