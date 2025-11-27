import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const isAdminGuard: CanMatchFn = async (route, state) => {
  console.log('notAuthenticatedGuard');

  const authService = inject(AuthService)
  const router = inject(Router)

  //Esperamos como si fuera una promesa
  // const isAdmin = await firstValueFrom(authService.checkStatus());
  // console.log(isAdmin)



  // return isAdmin;
  await firstValueFrom(authService.checkStatus());
  return authService.isAdmin();

};
