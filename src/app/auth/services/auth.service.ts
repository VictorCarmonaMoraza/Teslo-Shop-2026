import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

//checking: verificando token o sesión
//authenticated: usuario logeado
//not-authenticated: no hay sesión
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  // Almacena el usuario autenticado:
  //Si es null, significa que no hay usuario.
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);

  private http = inject(HttpClient);

  //Saber el estado
  authStatus = computed<AuthStatus>(() => {
    // Estado de autenticación
    if (this._authStatus() === 'checking') return 'checking';
    // Si hay un usuario autenticado
    if (this._user()) return 'authenticated';
    // Si no hay usuario autenticado
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());


  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password
    }).pipe(
      tap(resp => {
        this._authStatus.set('authenticated');
        this._user.set(resp.user);
        this._token.set(resp.token);

        //Grabamos el token en el localStorage
        localStorage.setItem('token', resp.token);
      }),
      map(() => true),
      //Cualquier estado que no sea 200 cae aquí
      catchError((error: any) => {
        //Limpiamos el usuario
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authenticated');
        return of(false)
      }
      ));
  }

}
