import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioI } from '../../../interfaces/usuario'
import { UsuarioService } from '../../../services/usuario.service'
import Swal from 'sweetalert2'


@Component({
  selector: 'app-header-principal',
  templateUrl: './header-principal.component.html',
  styleUrls: ['./header-principal.component.css']
})
export class HeaderPrincipalComponent implements OnInit {
  Toast:any = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  InicioSesionUsuario = new FormGroup({
    correo : new FormControl('',[Validators.required,Validators.email]),
    contra : new FormControl('',[Validators.required]),
  });

  InicioSesionAdmin = new FormGroup({
    correo : new FormControl('',[Validators.required,Validators.email]),
    contra : new FormControl('',[Validators.required])
  });
 
  constructor(private router:Router,private modalService:NgbModal,private usuarioService:UsuarioService) { }

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

  loginRegistrado():void{
     this.usuarioService.loginRegistrado(this.InicioSesionUsuario.value).subscribe(res=>{
       if(res.mensaje){
         this.Toast.fire({
          icon: 'error',
          title: `${res.mensaje}`
        })
       }else{
         this.router.navigate(['/blog']);
         this.modalService.dismissAll();
         this.Toast.fire({
          icon: 'success',
          title: `Bienvenido ${res.nombres}`
        })
       }
     })  
  }

  loginAdmin():void{
    this.usuarioService.loginAdmin(this.InicioSesionAdmin.value).subscribe(res=>{
      if(res.mensaje){
        console.log(res.mensaje);
        this.Toast.fire({
          icon: 'error',
          title: `${res.mensaje}`
        })
      }else{
        
        this.router.navigate(['/herramientas']);
        this.modalService.dismissAll();
        this.Toast.fire({
          icon: 'success',
          title: `Bienvenido ${res.nombres}`
        })
        this.InicioSesionAdmin.reset();
      }
    });
  }
  


  abrirLogin(modal:any){
    this.modalService.open(
        modal,
        {
          size:'xs',
          centered:false
        }
      )
  }

  abrirAcercaDe(modal:any){
    this.modalService.open(
        modal,
        {
          size:'lg',
          centered:true
        }
      )
  }

}
