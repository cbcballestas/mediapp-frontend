import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GenericService<T> {
  constructor(
    protected http: HttpClient,
    @Inject(String) protected url: string
  ) {}

  listar() {
    return this.http.get<T[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  registrar(t: T) {
    return this.http.post(this.url, t, { observe: 'response' }).pipe(
      map((resp) => {
        return resp.headers.get('Location');
      })
    );
  }

  modificar(t: T) {
    return this.http.put(this.url, t);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
