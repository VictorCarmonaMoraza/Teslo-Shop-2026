import { AuthService } from '@/auth/services/auth.service';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.html',
  styleUrl: './front-navbar.css',
})
export class FrontNavbar {
  authService = inject(AuthService);



}
