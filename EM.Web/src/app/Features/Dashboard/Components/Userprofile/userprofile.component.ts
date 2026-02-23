import { CommonModule } from "@angular/common";
import { MockPlatformLocation } from "@angular/common/testing";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { HttpClient } from "@angular/common/http";
import { UserProfileDto } from "../../../../Models/userprofile.dto";
import { AuthModule, AuthService } from "@auth0/auth0-angular";
import { UserResponseDto, UserService } from "../../../../Core/Services/user.service";
import { UpdateProfileButtonComponent } from "./updateprofile-button.component";
import { ConfirmDialogService } from "../../../../Core/Services/confirm.service";
import { MatDialogRef } from "@angular/material/dialog";
import { EditUserDialogComponent } from "../Admin-panel-dialogs/edit-user-dialog.component";

@Component({  selector: 'user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, AuthModule, UpdateProfileButtonComponent],
  templateUrl: './userprofile.component.html',
})


export class UserProfileComponent implements OnInit {
  user?: UserResponseDto;
  private fb = inject(FormBuilder)

    form = this.fb.group({
      username: new FormControl<string | null>(''),
      email: new FormControl<string | null>({value: '', disabled: true}),
      address: new FormControl<string | null>(''),
      role: new FormControl<string | null>(''),
    });
  

  constructor(private auth: AuthService, private userService: UserService, private confirmDialog: ConfirmDialogService) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe(user => {
      if (!user) return;

      this.user = user
      this.form.patchValue({
        username: user.username ?? '',
        email: user.email ?? '',
        address : user.address,
        role : user.role
      });
    });
  }
  onSave() {
    if (this.form.invalid) return;

    const updatedProfile: UserResponseDto = {
      user_Id: this.user?.user_Id ?? 0,
      username: this.form.value.username ?? '',
      email: this.form.value.email!,
      address: this.form.value.address ?? '',
      role: this.form.value.role ?? '',
      credits: this.user?.credits ?? 0,
      isActive: this.user?.isActive ?? true
    };
    this.confirmDialog.confirm({
    title: 'Are you sure?',
    message: 'Do you want to edit your profile?',
    confirmLabel: 'Edit',
    cancelLabel: 'Cancel'
  }, { panelClass: 'confirm-dialog-panel' })
    .subscribe(confirmed => {
      if (!confirmed) return;
    this.userService.updateMyProfile(updatedProfile).subscribe(() => {
      console.log('Profile updated successfully');
      this.auth.logout({logoutParams: {returnTo: window.location.origin}});
      
    });
  });

  }
  }