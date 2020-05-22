import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../../services/usuario.service'
import Swal from 'sweetalert2/src/sweetalert2.js'


@Component({
  selector: 'app-header-principal',
  templateUrl: './header-principal.component.html',
  styleUrls: ['./header-principal.component.css']
})
export class HeaderPrincipalComponent implements OnInit {
  Toast:any = Swal.mixin({
    toast: true,
    position: 'top-end',
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
  
  token:string=null;
  usuario:string;
  variable:number = 2;
  constructor(private router:Router,private modalService:NgbModal,private usuarioService:UsuarioService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("ACCESS_TOKEN")
    this.usuario = localStorage.getItem("USUARIO") 
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

         this.token=this.usuarioService.getToken();
         this.usuario = localStorage.getItem("USUARIO")
         this.router.navigate(['/blog']);
         this.modalService.dismissAll();
         this.Toast.fire({
          icon: 'success',
          title: `Bienvenido ${res.usuario}`
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
        this.token=this.usuarioService.getToken();
        this.usuario = localStorage.getItem("USUARIO")
        console.log("USUARIO",this.usuario)
        this.router.navigate(['/herramientas']);
        this.modalService.dismissAll();
        this.Toast.fire({
          icon: 'success',
          title: `Bienvenido ${res.usuario}`
        })
        this.InicioSesionAdmin.reset();
        console.log(this.usuarioService.getToken());
      }
    });
  }
  
  logout(){
    this.usuarioService.logout();
    this.token = localStorage.getItem("ACCESS_TOKEN")
    this.usuario = localStorage.getItem("USUARIO") 
    this.router.navigate(['/principal'])
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
