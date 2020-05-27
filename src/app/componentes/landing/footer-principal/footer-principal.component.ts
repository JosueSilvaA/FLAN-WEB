import { Component, OnInit } from '@angular/core';
import {faGithub } from '@fortawesome/free-brands-svg-icons'
@Component({
  selector: 'app-footer-principal',
  templateUrl: './footer-principal.component.html',
  styleUrls: ['./footer-principal.component.css']
})
export class FooterPrincipalComponent implements OnInit {
  faGithub = faGithub
  constructor() { }
  token:string=null;
  logueado:number = 0;
  ngOnInit(): void {
    this.token = sessionStorage.getItem("ACCESS_TOKEN");
    if(this.token== 'undefined' || this.token == null){
      this.token = null;
    }else{
        this.logueado = 1;
    }
  }

  bienvenida(estado){
    this.logueado = estado;
    console.log('estado en footer de sesion ',this.logueado);
  }
}
