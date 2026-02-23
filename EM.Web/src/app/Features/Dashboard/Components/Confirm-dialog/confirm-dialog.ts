import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="confirm-dialog">
      <h2 class="confirm-title">{{ data.title }}</h2>
      <p class="confirm-message">{{ data.message }}</p>

      <div class="confirm-actions">
        <button mat-raised-button class="confirm-cancel" (click)="dialogRef.close(false)">
          {{ data.cancelLabel || 'Cancel' }}
        </button>

        <button mat-raised-button class="confirm" (click)="dialogRef.close(true)">
          {{ data.confirmLabel || 'Confirm' }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title?: string;
      message?: string;
      confirmLabel?: string;
      cancelLabel?: string;
    }
  ) {}
}
