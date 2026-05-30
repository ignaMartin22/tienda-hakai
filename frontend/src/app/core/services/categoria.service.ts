import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Categoria {
  _id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  activa: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private url = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }

  // Admin
  getCategoriasAdmin(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.url}/admin`);
  }

  crearCategoria(data: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.url}/admin`, data);
  }

  editarCategoria(id: string, data: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.url}/admin/${id}`, data);
  }

  eliminarCategoria(id: string): Observable<any> {
    return this.http.delete(`${this.url}/admin/${id}`);
  }
}