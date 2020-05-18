import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-header-principal',
  templateUrl: './header-principal.component.html',
  styleUrls: ['./header-principal.component.css']
})
export class HeaderPrincipalComponent implements OnInit {



  InicioSesionUsuario = new FormGroup({
    correo : new FormControl('',[Validators.required,Validators.email]),
    contra : new FormControl('',[Validators.required]),
  });

  InicioSesionAdmin = new FormGroup({
    correo : new FormControl('',[Validators.required,Validators.email]),
    contra : new FormControl('',[Validators.required])
  });

  correoUsuario:string="josuemarkcs@gmail.com";
  contrasena:string="abc";
 
  constructor(private router:Router,private modalService:NgbModal) { }

  ngOnInit(): void {
  }


  get correoN(){
    return this.InicioSesionUsuario.get('correo');
  }

  get contraN(){
    return this.InicioSesionUsuario.get('contra');
  }

  get correoA(){
    return this.InicioSesionAdmin.get('correo');
  }

  get contraA(){
    return this.InicioSesionAdmin.get('contra');
  }

  Loguear(){
    
    console.log(this.InicioSesionUsuario.value.correo);
    console.log('Formulario valido: ',this.InicioSesionUsuario.valid)  
    this.router.navigate(['/blog'])
  }

  abrirLogin(modal){
    this.modalService.open(
        modal,
        {
          size:'xs',
          centered:false
        }
      )
  }

  abrirAcercaDe(modal){
    this.modalService.open(
        modal,
        {
          size:'lg',
          centered:true
        }
      )
  }

}
