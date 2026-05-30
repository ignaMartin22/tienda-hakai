import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImagenService {
  private url = `${environment.apiUrl}/imagenes`;

  constructor(private http: HttpClient) {}

  subirImagen(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('imagen', file);
    return this.http.post<{ url: string }>(this.url, formData);
  }
}