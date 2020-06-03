import { Component, OnInit, ViewChild } from '@angular/core';
import { FooterPrincipalComponent } from './footer-principal/footer-principal.component';
import {} from '../../services/pagina-principal.service';
import { PaginaPrincipalService } from './../../services/pagina-principal.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  @ViewChild('footer') footerComponent:FooterPrincipalComponent;
  constructor(private paginaPrincipalService:PaginaPrincipalService) { 
    
  }
  paginaPrincipal:any;
  ngOnInit(): void {
    this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(res=>{
      this.paginaPrincipal = res;
      
    });
  }

  estadoSesion(estado){
    this.footerComponent.bienvenida(estado);
  }

}
