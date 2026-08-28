import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService, Producto } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);

  producto: Producto | null = null;
  cargando = true;
  imagenActiva = 0;
tallaSeleccionada: { talla: string; stock: number } | null = null;
  cantidad = 1;
  agregado = false;

  get tallasDisponibles() {
  return this.producto?.tallas.filter(t => t.stock > 0) || [];
}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.cargarProducto(id);
  }

  
  cargarProducto(id: string): void {
    this.productoService.getProducto(id).subscribe({
      next: (p) => {
        this.producto = p;
        this.cargando = false;
        if (p.tallas.length === 1) this.tallaSeleccionada = p.tallas[0];
      },
      error: () => this.router.navigate(['/'])
    });
  }

agregarAlCarrito(): void {
  if (!this.producto) return;
  if (this.producto.tallas.length > 0 && !this.tallaSeleccionada) return;
  if (this.cantidad > (this.tallaSeleccionada?.stock || 0)) return;

  this.carritoService.agregar(
    this.producto,
    this.tallaSeleccionada?.talla || '',
    this.cantidad
  );
  this.agregado = true;
  setTimeout(() => this.agregado = false, 2000);
}
}