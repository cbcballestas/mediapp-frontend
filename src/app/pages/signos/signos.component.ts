import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignosService } from '../../_service/signos.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Signo } from '../../_model/signo';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css'],
})
export class SignosComponent implements OnInit {
  cantidad = 0;
  displayedColumns = [
    'id',
    'paciente',
    'fecha',
    'temperatura',
    'pulso',
    'ritmoRespiratorio',
    'acciones',
  ];
  dataSource: MatTableDataSource<Signo>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private signoService: SignosService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.signoService.getSignoCambio().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (lista, filter) =>
        JSON.stringify(lista).includes(filter);
    });

    this.signoService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });

    this.signoService.listarPageable(0, 10).subscribe((data) => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (lista = data.content, filter) =>
        JSON.stringify(lista).includes(filter);
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminar(signo: Signo) {
    this.signoService
      .eliminar(signo.idSigno)
      .pipe(
        switchMap(() => {
          return this.signoService.listar();
        })
      )
      .subscribe((data) => {
        this.signoService.setSignoCambio(data);
        this.signoService.setMensajeCambio('Se eliminó');
      });
  }

  mostrarMas(e: any) {
    this.signoService
      .listarPageable(e.pageIndex, e.pageSize)
      .subscribe((data) => {
        this.cantidad = data.totalElements;
        this.dataSource = new MatTableDataSource(data.content);
        this.dataSource.sort = this.sort;
      });
  }
}
