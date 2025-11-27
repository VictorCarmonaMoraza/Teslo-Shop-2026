import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanActivateFn = async (route, state) => {
  console.log('notAuthenticatedGuard');

  const authService = inject(AuthService)
  const router = inject(Router)

  //Esperamos como si fuera una promesa
  const isAuthenticated = await firstValueFrom(authService.checkStatus());
  console.log(isAuthenticated)

  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }





  return true;
};
