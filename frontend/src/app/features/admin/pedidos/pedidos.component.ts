import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Pedido {
  _id: string;
  productos: {
    productoId: { nombre: string; imagenes: string[] };
    nombre: string;
    talla: string;
    cantidad: number;
    precio: number;
  }[];
  total: number;
  estado: string;
  instagramHandle: string;
  notas: string;
  createdAt: string;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/pedidos`;

  pedidos: Pedido[] = [];
  cargando = true;
  pedidoAbierto: string | null = null;

  estados = ['pendiente', 'confirmado', 'cancelado'];

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.http.get<Pedido[]>(this.url).subscribe({
      next: (p) => { this.pedidos = p; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  togglePedido(id: string): void {
    this.pedidoAbierto = this.pedidoAbierto === id ? null : id;
  }

  cambiarEstado(id: string, estado: string): void {
    this.http.put(`${this.url}/${id}`, { estado }).subscribe({
      next: () => {
        const pedido = this.pedidos.find(p => p._id === id);
        if (pedido) pedido.estado = estado;
      }
    });
  }

  getEstadoClass(estado: string): string {
    return { pendiente: 'pendiente', confirmado: 'confirmado', cancelado: 'cancelado' }[estado] || '';
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}