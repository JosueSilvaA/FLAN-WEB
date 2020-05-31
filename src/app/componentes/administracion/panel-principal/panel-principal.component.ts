import { Component, OnInit } from '@angular/core';
import { faUserTie,faUser,faImage } from '@fortawesome/free-solid-svg-icons'
import { UsuarioService } from './../../../services/usuario.service';
import { PaginaPrincipalService } from './../../../services/pagina-principal.service';


@Component({
  selector: 'app-panel-principal',
  templateUrl: './panel-principal.component.html',
  styleUrls: ['./panel-principal.component.css']
})
export class PanelPrincipalComponent implements OnInit {
  ////////////////////////////////////
  faUserTie = faUserTie;
  faUser = faUser;
  faImage = faImage;
  ////////////////////////////////////
  alerta:number=1;

  ////////////////////////////////////
  roles:any =[];
  rolUsuarioRegistrado:string;
  rolUsuarioAdmin:string;
  cantidadUsuariosAdmins:any;
  cantidadUsuariosRegistrados:any;
  /////////////////////////////////////
  paginaPrincipal:any;

  constructor(private usuarioService:UsuarioService,private paginaPrincipalService:PaginaPrincipalService) { }

  ngOnInit(): void {
    this.usuarioService.obtenerRoles().subscribe(res=>{
      this.roles = res.roles;
      this.rolUsuarioRegistrado = this.roles[0]._id;
      this.rolUsuarioAdmin = this.roles[1]._id;
      this.usuarioService.obtenerUsuariosPorRol(this.rolUsuarioAdmin).subscribe(res=>{
        this.cantidadUsuariosAdmins = res.usuarios.length;
      });
      this.usuarioService.obtenerUsuariosPorRol(this.rolUsuarioRegistrado).subscribe(res=>{
        this.cantidadUsuariosRegistrados = res.usuarios.length;
      }); 
    });

    this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(res=>{
      console.log(res);
      this.paginaPrincipal = res;
      console.log(this.paginaPrincipal.imagenes.length)
    });
     
  }



}
