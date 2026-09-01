import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto } from '../../../core/services/producto.service';
import { CategoriaService, Categoria } from '../../../core/services/categoria.service';
import { ImagenService } from '../../../core/services/imagen.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private imagenService = inject(ImagenService);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  cargando = true;
  mostrarForm = false;
  editando: Producto | null = null;
  guardando = false;
  subiendoImagen = false;
  error = '';

  tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42', 'único'];

  form: any = {
    nombre: '',
    descripcion: '',
    precio: null,
    categoria: '',
    tallas: [],
    imagenes: [],
    activo: true,
    destacado: false
  };

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.productoService.getProductosAdmin().subscribe({
      next: (p) => { this.productos = p; this.cargando = false; },
      error: () => this.cargando = false
    });

  }

  cargarCategorias(): void {
    this.categoriaService.getCategoriasAdmin().subscribe({
      next: (c) => this.categorias = c
    });
  }

  abrirForm(producto?: Producto): void {
    this.editando = producto || null;
    this.form = producto ? {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      precioOferta: producto.precioOferta || null,
      categoria: producto.categoria._id,
      tallas: producto ? producto.tallas.map((t: any) => ({ talla: t.talla, stock: t.stock })) : [],
      imagenes: [...producto.imagenes],
      activo: producto.activo,
      destacado: producto.destacado
    } : {
      nombre: '', descripcion: '', precio: null,
      precioOferta: null,
      categoria: '', tallas: [], imagenes: [],
      stock: 0, activo: true, destacado: false
    };
    this.error = '';
    this.mostrarForm = true;
  }

  cerrarForm(): void {
    this.mostrarForm = false;
    this.editando = null;
    this.error = '';
  }

  toggleTalla(talla: string): void {
    const idx = this.form.tallas.findIndex((t: any) => t.talla === talla);
    if (idx >= 0) {
      this.form.tallas.splice(idx, 1);
    } else {
      this.form.tallas.push({ talla, stock: 0 });
    }
  }

  tieneTalla(talla: string): boolean {
    return this.form.tallas.some((t: any) => t.talla === talla);
  }

  getStockTalla(talla: string): number {
    return this.form.tallas.find((t: any) => t.talla === talla)?.stock || 0;
  }

  setStockTalla(talla: string, stock: number): void {
    const item = this.form.tallas.find((t: any) => t.talla === talla);
    if (item) item.stock = stock;
  }
  getStockTotal(producto: any): number {
    return producto.tallas.reduce((acc: number, t: any) => acc + t.stock, 0);
  }

  onImagenSeleccionada(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    this.subiendoImagen = true;
    this.imagenService.subirImagen(file).subscribe({
      next: (res) => {
        this.form.imagenes.push(res.url);
        this.subiendoImagen = false;
      },
      error: () => {
        this.error = 'Error al subir la imagen';
        this.subiendoImagen = false;
      }
    });
  }

  eliminarImagen(idx: number): void {
    const url = this.form.imagenes[idx];
    this.imagenService.eliminarImagen(url).subscribe();
    this.form.imagenes.splice(idx, 1);
  }

  guardar(): void {
    if (!this.form.nombre || !this.form.precio || !this.form.categoria) {
      this.error = 'Nombre, precio y categoría son obligatorios';
      return;
    }

    this.guardando = true;
    const obs = this.editando
      ? this.productoService.editarProducto(this.editando._id, this.form)
      : this.productoService.crearProducto(this.form);

    obs.subscribe({
      next: () => {
        this.productoService.invalidarCache();
        this.cargarProductos();
        this.cerrarForm();
        this.guardando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al guardar';
        this.guardando = false;
      }
    });
  }

  eliminar(id: string): void {
    if (!confirm('¿Seguro que querés eliminar este producto?')) return;
    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.productoService.invalidarCache();
        this.cargarProductos();
      }
    });
  }


}