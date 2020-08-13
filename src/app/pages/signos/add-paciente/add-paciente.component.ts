import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PacienteService } from '../../../_service/paciente.service';
import { SignosService } from '../../../_service/signos.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-paciente',
  templateUrl: './add-paciente.component.html',
  styleUrls: ['./add-paciente.component.css'],
})
export class AddPacienteComponent implements OnInit {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddPacienteComponent>,
    private pacienteService: PacienteService,
    private signosService: SignosService,
    private fb: FormBuilder
  ) {
    this._buildForm();
  }

  ngOnInit(): void {}

  operar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.pacienteService
      .registrar(this.form.value)
      .pipe(
        switchMap((data) => {
          const pathname = new URL(data).pathname;
          const splitted = pathname.split('/');
          const pacienteId = Number(splitted[2]);
          return this.pacienteService.listarPorId(pacienteId);
        })
      )
      .subscribe((data) => {
        this.signosService.setMensajeCambio('Paciente registrado con éxito');

        const info = {
          flag: true,
          paciente: data,
        };

        this.dialogRef.close(info);
        this.form.reset();
      });
  }

  cancelar() {
    this.dialogRef.close();
  }

  private _buildForm(): void {
    this.form = this.fb.group({
      id: [0],
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      dni: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          ,
          Validators.maxLength(8),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          ,
          Validators.maxLength(9),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
      direccion: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  get nombres() {
    return this.form.get('nombres');
  }
  get apellidos() {
    return this.form.get('apellidos');
  }
  get dni() {
    return this.form.get('dni');
  }
  get telefono() {
    return this.form.get('telefono');
  }
  get email() {
    return this.form.get('email');
  }
  get direccion() {
    return this.form.get('direccion');
  }
}
