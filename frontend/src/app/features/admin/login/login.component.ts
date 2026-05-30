import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  cargando = false;

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Completá todos los campos';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/admin/productos']),
      error: () => {
        this.error = 'Email o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }
}