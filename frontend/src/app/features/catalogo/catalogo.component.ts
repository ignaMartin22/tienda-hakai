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
  ofertas: Producto[] = [];
  categoriaActiva: string = '';
  cargando = true;
  ofertaActiva = 0;
  imagenActiva = 0;
  Math = Math;

  imagenes = [
    'https://res.cloudinary.com/do8lcskoq/image/upload/v1787953710/hero_hey_men.webp',
    'https://res.cloudinary.com/do8lcskoq/image/upload/v1787954145/hero_slide2.webp',
    'https://res.cloudinary.com/do8lcskoq/image/upload/v1787954146/hero_slide3.webp'
  ]

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarDestacados();
    this.cargarProductos();
    this.iniciarSlider();
    this.cargarOfertas();
  }


  cargarOfertas():void{
    this.productoService.getProductos({ destacado: true }).subscribe({
      next: (prods) => this.ofertas = prods.filter(p => p.precioOferta),
    error: (err) => console.error(err)
  });
  }

  anteriorOferta(): void {
  this.ofertaActiva = this.ofertaActiva === 0 ? this.ofertas.length - 1 : this.ofertaActiva - 1;
}

siguienteOferta(): void {
  this.ofertaActiva = (this.ofertaActiva + 1) % this.ofertas.length;
}


  iniciarSlider():void{
    setInterval(() => {
     this.imagenActiva = (this.imagenActiva + 1) % this.imagenes.length;
    }, 4000);
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