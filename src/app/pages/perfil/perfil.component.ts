import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

import { LoginService } from '../../_service/login.service';
import { MenuService } from '../../_service/menu.service';
import { Menu } from '../../_model/menu';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  decodedToken: any;
  constructor(
    private loginService: LoginService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this._mostrarDatos();
  }

  private _mostrarDatos() {
    const rpta = this.loginService.estaLogueado();
    if (!rpta) {
      this.loginService.cerrarSesion();
      return;
    } else {
      const helper = new JwtHelperService();
      const token = sessionStorage.getItem(environment.TOKEN_NAME);
      this.decodedToken = helper.decodeToken(token);

      this.menuService
        .listarPorUsuario(this.decodedToken.user_name)
        .subscribe((data) => {
          this.menuService.setMenuCambio(data);
        });
    }
  }
}
