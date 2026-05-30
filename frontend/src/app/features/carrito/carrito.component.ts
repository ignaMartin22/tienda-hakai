import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent {
  carritoService = inject(CarritoService);

  confirmarPedido(): void {
    const link = this.carritoService.generarLinkInstagram();
    window.open(link, '_blank');
  }
}