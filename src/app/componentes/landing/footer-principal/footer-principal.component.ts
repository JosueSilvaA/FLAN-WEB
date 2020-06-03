import { Component, OnInit } from '@angular/core';
import {faGithub } from '@fortawesome/free-brands-svg-icons'
import {} from '../../../services/pagina-principal.service';
import { PaginaPrincipalService } from './../../../services/pagina-principal.service';

@Component({
  selector: 'app-footer-principal',
  templateUrl: './footer-principal.component.html',
  styleUrls: ['./footer-principal.component.css']
})
export class FooterPrincipalComponent implements OnInit {
  faGithub = faGithub
  constructor(private paginaPrincipalService:PaginaPrincipalService) { }
  
  token:string=null;
  logueado:number = 0;
  piePagina:any;
  titulo:any;
  ngOnInit(): void {
    this.token = sessionStorage.getItem("ACCESS_TOKEN");
    if(this.token== 'undefined' || this.token == null){
      this.token = null;
    }else{
        this.logueado = 1;
    }

    this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(res=>{
      this.piePagina = res.piePagina;
      this.titulo = res.titulo
    });
  }

  bienvenida(estado){
    this.logueado = estado;
  }
}
