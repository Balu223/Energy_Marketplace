import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DebugTokenService } from '../../../../Core/Services/user.service';

@Component({
  selector: 'update-profile-button',
  standalone: true,
  template: `<button (click)="onClick()">Save</button>`
})
export class UpdateProfileButtonComponent {
   
@Output() save = new EventEmitter<void>();
  onClick() {
    this.save.emit();
  }
}
