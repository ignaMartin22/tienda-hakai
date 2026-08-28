import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Talla {
  talla: string;
  stock: number;
}

export interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOferta: number | null;
  categoria: { _id: string; nombre: string; slug: string };
  tallas: Talla[];
  imagenes: string[];
  activo: boolean;
  destacado: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  getProductos(filtros?: { categoria?: string; destacado?: boolean; talla?: string }): Observable<Producto[]> {
    let params = new HttpParams();
    if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
    if (filtros?.destacado) params = params.set('destacado', 'true');
    if (filtros?.talla) params = params.set('talla', filtros.talla);
    return this.http.get<Producto[]>(this.url, { params });
  }

  getProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  // Admin
  getProductosAdmin(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/admin/todos`);
  }

  crearProducto(data: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(`${this.url}/admin`, data);
  }

  editarProducto(id: string, data: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/admin/${id}`, data);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.url}/admin/${id}`);
  }
}