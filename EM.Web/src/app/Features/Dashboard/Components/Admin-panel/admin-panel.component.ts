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
import { UpdateProfileButtonComponent } from "../Userprofile/updateprofile-button.component";
import { MarketplaceService, MarketplaceSummaryItem } from "../../../../Core/Services/marketplace.service";
import { Observable } from "rxjs";

@Component({  selector: 'admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, AuthModule],
  templateUrl: './admin-panel.component.html',
})


export class AdminPanelComponent implements OnInit {
  users?: UserResponseDto[];
  data$!: Observable<MarketplaceSummaryItem[]>;
  constructor(private auth: AuthService, private userService: UserService, private marketplaceService: MarketplaceService) {}

  ngOnInit(): void {
    this.userService.listUsers().subscribe(users => {
      this.users = users;
    });
    this.data$ = this.marketplaceService.getSummary();
  }
  editUser(user: UserResponseDto) {
    // Implement edit user logic here
    console.log('Edit user:', user);
  }
    deleteUser(userId: number) {
    // Implement delete user logic here
    console.log('Delete user with ID:', userId);
  }
    deactivateUser(userId: number) {
    // Implement deactivate user logic here
    console.log('Deactivate user with ID:', userId);
    }
    createUser() {
    // Implement create user logic here
    console.log('Create new user');
    }
    updatePrice(item: MarketplaceSummaryItem) {
    // Implement update price logic here
    console.log('Update price for item:', item);
    }

}