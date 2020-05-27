import { Component, OnInit, ViewChild } from '@angular/core';
import { FooterPrincipalComponent } from './footer-principal/footer-principal.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  @ViewChild('footer') footerComponent:FooterPrincipalComponent;
  constructor() { }

  ngOnInit(): void {
  }

  estadoSesion(estado){
    console.log('Estado de la sesion ahorita ',estado);
    this.footerComponent.bienvenida(estado);
  }

}
