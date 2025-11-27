import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

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

  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    stream: () => this.checkStatus()
  })

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
      map((resp) => this.handleAuthSuccess(resp)),
      // map(() => true),
      //Cualquier estado que no sea 200 cae aquí
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  register(email: string, password: string, fullName: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
      email: email,
      password: password,
      fullName: fullName
    }).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      // map(() => true),
      //Cualquier estado que no sea 200 cae aquí
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  checkStatus(): Observable<boolean> {
    //Devolvemos el token si tenemos del localstorage
    const token = localStorage.getItem('token')
    if (!token) {
      this.logout();
      return of(false)
    }
    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // }
    }
    ).pipe(
      map((resp) => this.handleAuthSuccess(resp)),
      // map(() => true),
      //Cualquier estado que no sea 200 cae aquí
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    //Borramos de localStorage el token
    //TODO : revertir
    localStorage.removeItem('token');
  }

  //private handleAuthSuccess(resp: AuthResponse) {
  private handleAuthSuccess({ token, user }: AuthResponse) {
    this._authStatus.set('authenticated');
    this._user.set(user);
    this._token.set(token);

    //Grabamos el token en el localStorage
    localStorage.setItem('token', token);
    return true
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

}
