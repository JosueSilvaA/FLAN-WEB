import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel-principal',
  templateUrl: './panel-principal.component.html',
  styleUrls: ['./panel-principal.component.css']
})
export class PanelPrincipalComponent implements OnInit {

  alerta:number=1;
  constructor() { }

  ngOnInit(): void {
  }

}
