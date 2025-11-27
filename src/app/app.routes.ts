import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from './auth/guards/not-authenticated-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    //TODO: Guards
    canMatch: [
      notAuthenticatedGuard,
      () => {
        console.log('Estamos en los guard')
      }
    ]
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes')
  }
];
