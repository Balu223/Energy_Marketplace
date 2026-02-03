import { CommonModule } from "@angular/common";
import { MockPlatformLocation } from "@angular/common/testing";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";

@Component({  selector: 'user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './userprofile.component.html',
})


export class UserProfileComponent {
  protected form = inject(FormBuilder).group({
    username: new FormControl('Smith', [Validators.required]),
    email: new FormControl('office@smith.com', [Validators.required, Validators.email]),
    address: new FormControl('Broadway', [Validators.required]),
    role : new FormControl('User', [Validators.required])
  });
}