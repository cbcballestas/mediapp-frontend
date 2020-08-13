import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { SignosService } from '../../../_service/signos.service';
import { Paciente } from '../../../_model/paciente';
import { PacienteService } from '../../../_service/paciente.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPacienteComponent } from '../add-paciente/add-paciente.component';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css'],
})
export class SignosEdicionComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacientesFiltrados$: Observable<Paciente[]>;

  myControlPaciente = new FormControl('', Validators.required);

  id: number;
  form: FormGroup;
  edicion = false;
  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  constructor(
    private signoService: SignosService,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this._buildForm();
  }

  ngOnInit() {
    this._cargarInfoPaciente();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this._initForm();
    });
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  abrirDialogo() {
    const dialogRef = this.dialog.open(AddPacienteComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      this._cargarInfoPaciente();
      if (data.flag) {
        this.paciente.setValue(data.paciente);
      }
    });
  }

  operar() {
    this.form.value['fecha'] = moment(this.fechaSeleccionada).format(
      'YYYY-MM-DDTHH:mm:ss'
    );

    if (this.edicion) {
      this.signoService
        .modificar(this.form.value)
        .pipe(
          switchMap(() => {
            return this.signoService.listar();
          })
        )
        .subscribe((data) => {
          this.signoService.setSignoCambio(data);
          this.signoService.setMensajeCambio('Se modificó');
        });
    } else {
      // PRACTICA COMUN
      this.signoService.registrar(this.form.value).subscribe(() => {
        this.signoService.listar().subscribe((signo) => {
          this.signoService.setSignoCambio(signo);
          this.signoService.setMensajeCambio('Se registró');
        });
      });
    }
    this.form.reset();
    this.router.navigate(['signos-vitales']);
  }

  private _cargarInfoPaciente() {
    this._listarPacientes();
    this.pacientesFiltrados$ = this.paciente.valueChanges.pipe(
      map((value) => this._filterPaciente(value))
    );
  }

  private _filterPaciente(value: any) {
    if (value != null) {
      if (value.idPaciente > 0) {
        return this.pacientes.filter(
          (el) =>
            el.nombres.toLowerCase().includes(value.nombres.toLowerCase()) ||
            el.apellidos
              .toLowerCase()
              .includes(value.apellidos.toLowerCase()) ||
            el.dni.toLowerCase().includes(value.dni.toLowerCase())
        );
      } else {
        return this.pacientes.filter(
          (el) =>
            el.nombres.toLowerCase().includes(value.toLowerCase()) ||
            el.apellidos.toLowerCase().includes(value.toLowerCase()) ||
            el.dni.toLowerCase().includes(value.toLowerCase())
        );
      }
    }
  }

  private _buildForm(): void {
    this.form = this.fb.group({
      idSigno: [0],
      paciente: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      temperatura: ['', Validators.required],
      pulso: ['', Validators.required],
      ritmoRespiratorio: ['', Validators.required],
    });
  }

  private _initForm() {
    if (this.edicion) {
      this.signoService.listarPorId(this.id).subscribe((data) => {
        this.form.setValue({
          idSigno: data.idSigno,
          paciente: data.paciente,
          fecha: data.fecha,
          temperatura: data.temperatura,
          pulso: data.pulso,
          ritmoRespiratorio: data.ritmoRespiratorio,
        });
      });
    }
  }

  private _listarPacientes() {
    this.pacienteService.listar().subscribe((data) => {
      this.pacientes = data;
    });
  }

  get paciente() {
    return this.form.get('paciente');
  }
  get fecha() {
    return this.form.get('fecha');
  }
  get temperatura() {
    return this.form.get('temperatura');
  }
  get pulso() {
    return this.form.get('pulso');
  }
  get ritmoRespiratorio() {
    return this.form.get('ritmoRespiratorio');
  }
}
