import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admininistracion',
  templateUrl: './admininistracion.component.html',
  styleUrls: ['./admininistracion.component.css']
})
export class AdmininistracionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  cambio:number=0;
  ocultarSidebar(){
    if(this.cambio==0){
      this.cambio=1;
    }else{
      this.cambio=0
    }
  } 
}
