import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), JsonPipe, AsyncPipe]
})
  .catch((err) => console.error(err));