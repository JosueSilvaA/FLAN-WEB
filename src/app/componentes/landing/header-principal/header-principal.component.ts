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
  token:string=null;
  usuario:string;
  fotoPerfil:string='../../../../assets/img/perfil_default.jpg';
  public isMenuCollapsed = true;
  opcionPerfil:number=0;
  opcionPerfilInfo:number=0;
  opcionPerfilFoto:number=0;

  
  constructor(private router:Router,private modalService:NgbModal,private usuarioService:UsuarioService) { }

  ngOnInit(): void {
    this.token = sessionStorage.getItem("ACCESS_TOKEN")
    this.usuario = sessionStorage.getItem("USUARIO") 
  }

  
  InicioSesionUsuario = new FormGroup({
    correo : new FormControl('',[Validators.required,Validators.email]),
    contra : new FormControl('',[Validators.required]),
  });

  InicioSesionAdmin = new FormGroup({
    correo : new FormControl('',[Validators.required,Validators.email]),
    contra : new FormControl('',[Validators.required])
  });
  
  EditarInfoUsuario = new FormGroup({
    correo : new FormControl('',[Validators.required,Validators.email]),
    usuario : new FormControl('',[Validators.required]),
    contrasena : new FormControl('',[Validators.required]),
    telefono  : new FormControl('',[Validators.required,Validators.minLength(8)]),
  });

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

  get correoP(){
    return this.EditarInfoUsuario.get('correo');
  }

  get usuarioP(){
    return this.EditarInfoUsuario.get('usuario');
  }

  get contrasenaP(){
    return this.EditarInfoUsuario.get('contrasena');
  }

  get telefonoP(){
    return this.EditarInfoUsuario.get('telefono');
  }

  Toast:any = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  loginRegistrado():void{
     this.usuarioService.loginRegistrado(this.InicioSesionUsuario.value).subscribe(res=>{
       if(res.mensaje){
         this.Toast.fire({
          icon: 'error',
          title: `${res.mensaje}`
        })
       }else{

         this.token=this.usuarioService.getToken();
         this.usuario = sessionStorage.getItem("USUARIO")
         this.router.navigate(['/blog']);
         this.modalService.dismissAll();
         this.Toast.fire({
          icon: 'success',
          title: `Bienvenid@ ${res.usuario}`
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
        this.usuario = sessionStorage.getItem("USUARIO")
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
    this.token = sessionStorage.getItem("ACCESS_TOKEN")
    this.usuario = sessionStorage.getItem("USUARIO") 
    this.router.navigate(['/principal'])
  }

  //////////////////////////////
  editarInfoUsuario(){
    this.usuarioService.editarUsuario(this.EditarInfoUsuario.value)
    .subscribe(res=>{
      if(res.n==1){
        this.usuarioService.obtenerUsuario(sessionStorage.getItem('ID')).subscribe(result=>{
          this.usuario = result.usuario;
          this.modalService.dismissAll();
        });
      }
    })
  }

  //////////////////////////////

  infoUsuarioLogueado():void{
    
    this.opcionPerfilInfo=1;
    this.opcionPerfil=1;
    this.usuarioService.obtenerUsuario(sessionStorage.getItem('ID')).subscribe(res=>{
      console.log(res);
      this.EditarInfoUsuario.controls['correo'].setValue(res.correo);
      this.EditarInfoUsuario.controls['usuario'].setValue(res.usuario);
      this.EditarInfoUsuario.controls['telefono'].setValue(res.telefono);
    });
  }

  //MODALES DEL HEADER PRINCIPAL

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

  abrirEditarPerfil(modal:any){
    this.modalService.open(
      modal,
      {
        size:'md',
        centered:true
      }
    )
  }

  cerrarModal(){
    this.modalService.dismissAll();
  }

}
