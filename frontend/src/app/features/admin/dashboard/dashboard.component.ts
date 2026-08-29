import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  sidebarAbierto = false;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  cerrarSidebar(): void {
    this.sidebarAbierto = false;
  }
}