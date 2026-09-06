import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
export class CatalogoComponent implements OnInit, OnDestroy {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);

  Math = Math;
  productos: Producto[] = [];
  destacados: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaActiva = '';
  cargando = true;
  pagina = 1;
  totalPaginas = 1;
  enOferta = false;
  imagenActiva = 0;
  private sliderInterval: any;

  imagenes = [
    'https://res.cloudinary.com/do8lcskoq/image/upload/v1787953710/hero_hey_men.webp',
    'https://res.cloudinary.com/do8lcskoq/image/upload/v1787954145/hero_slide2.webp',
    'https://res.cloudinary.com/do8lcskoq/image/upload/v1787954146/hero_slide3.webp'
  ];

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarDestacados();
    this.cargarProductos();
    this.iniciarSlider();
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) clearInterval(this.sliderInterval);
  }

  iniciarSlider(): void {
    if (this.imagenes.length <= 1) return;
    this.sliderInterval = setInterval(() => {
      this.imagenActiva = (this.imagenActiva + 1) % this.imagenes.length;
    }, 4000);
  }

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
  cargarCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (cats) => this.categorias = cats,
      error: (err) => console.error(err)
    });
  }

  cargarDestacados(): void {
    this.productoService.getProductos({ destacado: true, limit: 4 }).subscribe({
      next: (res) => this.destacados = res.productos,
      error: (err) => console.error(err)
    });
  }

  cargarProductosConFiltro(): void {
    this.cargando = true;
    this.productoService.getProductos({
      categoria: this.categoriaActiva || undefined,
      enOferta: this.enOferta || undefined,
      page: this.pagina,
      limit: 12
    }).subscribe({
      next: (res) => {
        this.productos = res.productos;
        this.totalPaginas = res.totalPaginas;
        this.pagina = res.pagina;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  cargarProductos(categoriaId?: string, pagina = 1): void {
    this.pagina = pagina;
    this.cargarProductosConFiltro();
  }

  filtrarPorCategoria(categoriaId: string): void {
    this.categoriaActiva = categoriaId;
    this.enOferta = false;
    this.pagina = 1;
    this.cargarProductosConFiltro();
  }

  filtrarOfertas(): void {
    this.categoriaActiva = '';
    this.enOferta = true;
    this.pagina = 1;
    this.cargarProductosConFiltro();
  }

  cambiarPagina(pagina: number): void {
    this.pagina = pagina;
    this.cargarProductos(this.categoriaActiva || undefined, pagina);
    document.querySelector('.catalogo')?.scrollIntoView({ behavior: 'smooth' });
  }
}