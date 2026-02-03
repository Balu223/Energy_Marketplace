import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { tap } from "rxjs";

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
    return auth.isAuthenticated$.pipe(
        tap (isAuth => {
            if (!isAuth) {
                auth.loginWithRedirect(
                    { appState: { target: router.url || '/dashboard' } }
                );
            }
        }
    )
    );
};