import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable, map } from "rxjs";
import { ConfirmDialogComponent } from "../../Features/Dashboard/Components/Admin-panel/admin-panel.component";

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  confirm(options: {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }, config?: MatDialogConfig): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: options,
      panelClass: 'confirm-dialog-panel',
      ...config
    });

    return dialogRef.afterClosed().pipe(
      map(result => !!result)
    );
  }
}