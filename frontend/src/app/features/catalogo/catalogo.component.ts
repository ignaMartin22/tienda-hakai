import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoService, Producto } from '../../core/services/producto.service';
import { CategoriaService, Categoria } from '../../core/services/categoria.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);

  productos: Producto[] = [];
  destacados: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaActiva: string = '';
  cargando = true;

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarDestacados();
    this.cargarProductos();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (cats) => this.categorias = cats,
      error: (err) => console.error(err)
    });
  }

  cargarDestacados(): void {
    this.productoService.getProductos({ destacado: true }).subscribe({
      next: (prods) => this.destacados = prods,
      error: (err) => console.error(err)
    });
  }

  cargarProductos(categoriaId?: string): void {
    this.cargando = true;
    this.productoService.getProductos({ categoria: categoriaId }).subscribe({
      next: (prods) => {
        this.productos = prods;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  filtrarPorCategoria(categoriaId: string): void {
    this.categoriaActiva = categoriaId;
    this.cargarProductos(categoriaId || undefined);
  }
}