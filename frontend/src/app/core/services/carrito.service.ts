import { Injectable, signal, computed } from '@angular/core';
import { Producto } from './producto.service';

export interface ItemCarrito {
  producto: Producto;
  talla: string;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private instagramHandle = 'lovekhai___';
  items = signal<ItemCarrito[]>([]);

  total = computed(() =>
    this.items().reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)
  );

  cantidadTotal = computed(() =>
    this.items().reduce((acc, item) => acc + item.cantidad, 0)
  );

  agregar(producto: Producto, talla: string, cantidad: number = 1): void {
    const actual = this.items();
    const idx = actual.findIndex(i => i.producto._id === producto._id && i.talla === talla);

    if (idx >= 0) {
      const nuevos = [...actual];
      nuevos[idx] = { ...nuevos[idx], cantidad: nuevos[idx].cantidad + cantidad };
      this.items.set(nuevos);
    } else {
      this.items.set([...actual, { producto, talla, cantidad }]);
    }
  }

  eliminar(productoId: string, talla: string): void {
    this.items.set(this.items().filter(i => !(i.producto._id === productoId && i.talla === talla)));
  }

  vaciar(): void {
    this.items.set([]);
  }

  generarLinkInstagram(): string {
    const detalle = this.items().map(item =>
      `▪ ${item.producto.nombre} | Talla: ${item.talla} | x${item.cantidad} | $${item.producto.precio.toLocaleString('es-AR')}`
    ).join('\n');

    const mensaje = encodeURIComponent(
      `Hola! Quiero hacer un pedido 🛍️\n\n${detalle}\n\nTotal: $${this.total().toLocaleString('es-AR')}`
    );

    return `https://ig.me/m/${this.instagramHandle}?text=${mensaje}`;
  }
}