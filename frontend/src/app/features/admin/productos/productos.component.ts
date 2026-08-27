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
    stock: 0,
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
      categoria: producto.categoria._id,
      tallas: [...producto.tallas],
      imagenes: [...producto.imagenes],
      stock: producto.stock,
      activo: producto.activo,
      destacado: producto.destacado
    } : {
      nombre: '', descripcion: '', precio: null,
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
    const idx = this.form.tallas.indexOf(talla);
    if (idx >= 0) this.form.tallas.splice(idx, 1);
    else this.form.tallas.push(talla);
  }

  tieneTalla(talla: string): boolean {
    return this.form.tallas.includes(talla);
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
      next: () => this.cargarProductos()
    });
  }
}