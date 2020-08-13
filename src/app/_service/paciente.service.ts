import { GenericService } from './generic.service';
import { Paciente } from './../_model/paciente';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PacienteService extends GenericService<Paciente> {
  pacienteCambio = new Subject<Paciente[]>();
  mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/pacientes`);
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}
