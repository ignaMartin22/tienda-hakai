import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  carritoService = inject(CarritoService);
  menuAbierto = false;
  
  irAProductos(): void {
  this.menuAbierto = false;
  const el = document.querySelector('.catalogo');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = '/';
  }
}
}