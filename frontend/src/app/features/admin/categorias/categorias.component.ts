import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);

  categorias: Categoria[] = [];
  cargando = true;
  mostrarForm = false;
  editando: Categoria | null = null;

  form = { nombre: '', descripcion: '' };
  error = '';
  guardando = false;

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.getCategoriasAdmin().subscribe({
      next: (cats) => {
        this.categorias = cats;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  abrirForm(categoria?: Categoria): void {
    this.editando = categoria || null;
    this.form = {
      nombre: categoria?.nombre || '',
      descripcion: categoria?.descripcion || ''
    };
    this.error = '';
    this.mostrarForm = true;
  }

  cerrarForm(): void {
    this.mostrarForm = false;
    this.editando = null;
    this.form = { nombre: '', descripcion: '' };
  }

  guardar(): void {
    if (!this.form.nombre.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    this.guardando = true;
    const obs = this.editando
      ? this.categoriaService.editarCategoria(this.editando._id, this.form)
      : this.categoriaService.crearCategoria(this.form);

    obs.subscribe({
      next: () => {
        this.cargarCategorias();
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
    if (!confirm('¿Seguro que querés eliminar esta categoría?')) return;
    this.categoriaService.eliminarCategoria(id).subscribe({
      next: () => this.cargarCategorias()
    });
  }
}