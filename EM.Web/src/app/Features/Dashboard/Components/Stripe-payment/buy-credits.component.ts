import { Component, AfterViewInit, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { StripeService } from '../../../../Core/Services/stripe.service';
import { UserResponseDto, UserService } from '../../../../Core/Services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { AuthModule } from '@auth0/auth0-angular';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogService } from '../../../../Core/Services/confirm.service';


@Component({
  selector: 'app-buy-credits',
  standalone: true,
  templateUrl: './buy-credits.component.html',
   imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormField, MatInputModule, ReactiveFormsModule, MatSnackBarModule, MatIcon],
})
export class BuyCreditsDialogComponent implements AfterViewInit {
  @ViewChild('cardElement') cardElementRef!: ElementRef;
  form: FormGroup;
  private card: any;
  isProcessing = false;
  message = '';
  user: UserResponseDto | null = null;
  user$: Observable<UserResponseDto>;

  constructor(private stripeService: StripeService, private confirmDialog: ConfirmDialogService, private userService: UserService,private fb: FormBuilder, private dialogRef: MatDialogRef<BuyCreditsDialogComponent>, private snackbar: MatSnackBar, private cdr: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public data: {credits: number}
  ){
      this.form = this.fb.group({
      credits: this.data.credits ?? 0
    });
    this.user$ = this.userService.getMe();
    this.user$.subscribe(user => {
      this.user = user});
  }


  ngAfterViewInit() {
    const stripe = this.stripeService.getStripe();
    const elements = stripe.elements();
    this.card = elements.create('card');
    this.card.mount(this.cardElementRef.nativeElement);
  }
  increment() {
    const control = this.form.get('credits');
    const current = Number(control?.value ?? 0);
    control?.setValue(current + 1);
  }
  decrement() {
    const control = this.form.get('credits');
    const current = Number(control?.value ?? 0);
     if (current > 175) {
      control?.setValue(current - 1);
      
     }else if (current == 175){
      this.showError("Amount must be at least 175 HUF.")
     }
  }

  async pay() {
  this.isProcessing = true;
  this.message = '';

  const credits = Number(this.form.get('credits')?.value ?? 0);
  if (credits <= 0) {
    this.showError('Please enter a valid credit amount.');
    this.isProcessing = false;
    return;
  }
this.confirmDialog.confirm({
      title: 'Are you sure?',
      message: `Do you want to get ${credits} credits for ${credits} HUF?`,
      confirmLabel: 'Purchase',
      cancelLabel: 'Cancel'
    
  }, {panelClass: 'confirm-dialog-panel'}).subscribe((confirmed: any) => {
    if (confirmed) { 
  this.stripeService.createPaymentIntent(credits).subscribe(async (res) => {
    const stripe = this.stripeService.getStripe();

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      res.clientSecret,
      { payment_method: { card: this.card } }
    );

    console.log('Stripe confirm result', { error, paymentIntent });

    if (error) {
      console.error('Stripe error', error);
      this.showError(error);
      this.isProcessing = false;
      this.cdr.detectChanges();
    } else if (paymentIntent) {
      console.log('PaymentIntent status:', paymentIntent.status);

      if (paymentIntent.status === 'succeeded') {
        const updateProfileRequest: UserResponseDto = {
          user_Id: this.user!.user_Id,
          credits: (this.user!.credits + credits),
          username: this.user!.username,
          email: this.user!.email,
          address: this.user!.address,
          role: this.user!.role,
          isActive: this.user!.isActive
        };
        
        this.userService.updateMyProfile(updateProfileRequest).subscribe({
          next: () => {
          this.userService.getMe().subscribe();
          this.showSuccess(`Payment successful! ${credits} credits added.`);;
          this.dialogRef.close(true);
    }});
      return;
    }

      this.isProcessing = false;
    } else {
      this.showError('Unknown payment state.');
      this.isProcessing = false;
      this.cdr.detectChanges();
    }
  });
} else {
  this.isProcessing = false;
  this.cdr.detectChanges();
}});
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
  close() {
    this.dialogRef.close(false);
  }
}