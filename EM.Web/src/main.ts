import { bootstrapApplication } from '@angular/platform-browser';
import { mergeApplicationConfig } from '@angular/core';
import { provideRouter, provideRoutes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { provideAuth0, authHttpInterceptorFn } from '@auth0/auth0-angular';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

const appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideCharts(withDefaultRegisterables()),
  ],
}

const auth0Config = mergeApplicationConfig(appConfig, {
  providers: [
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
});

bootstrapApplication(AppComponent, auth0Config).catch(err => console.error(err));