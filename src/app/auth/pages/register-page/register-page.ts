import { AuthService } from '@/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {

  fb = inject(FormBuilder);
  hasError = signal(false);
  isCreateOK = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 2000);
      this.registerForm.reset();
      return;
    }
    //Si todo va bien
    const { email = '', password = '', fullName = '' } = this.registerForm.value;
    console.log({ email, password, fullName });
    this.authService.register(email!, password!, fullName!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.isCreateOK.set(true);
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 3000);
        return;
      }
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(true);
      })
    });
  }

}
