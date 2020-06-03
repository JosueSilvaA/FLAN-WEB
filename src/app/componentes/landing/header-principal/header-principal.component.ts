import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../../services/usuario.service'
import Swal from 'sweetalert2/src/sweetalert2.js'
import { AngularFireStorage } from '@angular/fire/storage'
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { faExclamationTriangle,faUnlock } from '@fortawesome/free-solid-svg-icons'
import { PaginaPrincipalService } from './../../../services/pagina-principal.service';
import { PaginaService } from '../../../services/pagina.service'

interface HtmlInputEvent extends Event{
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-header-principal',
  templateUrl: './header-principal.component.html',
  styleUrls: ['./header-principal.component.css']
})
export class HeaderPrincipalComponent implements OnInit {
  @Output() estadoLogueado = new EventEmitter();
  ///////ICONOS///////////////////
  faExclamation = faExclamationTriangle;
  faUnlock = faUnlock
  ///////VARIABLES GLOBALES///////
  token:string=null;
  usuario:string;
  fotoPerfil:string;
  tipoUsuario:number=1;
  public isMenuCollapsed = true;
  opcionPerfil:number=0;
  opcionPerfilInfo:number=0;
  opcionPerfilFoto:number=0;
  file : File;
  fotoSelect:string | ArrayBuffer;
  filePath:string
  estadoSesion:number =  0;
  ////////////////////////////////
  tituloPaginaPrincipal:any;
  logoPaginaPrincipal:any;
  ////////////////////////////////
  paginas:any = [];
  public load: boolean;
  constructor(private router:Router,private modalService:NgbModal,private usuarioService:UsuarioService,private firestorage:AngularFireStorage,private paginaPrincipalService:PaginaPrincipalService,private paginaService:PaginaService) {
    this.load = false;
   }
  uploadPorcent: Observable<number>;
  urlImage: Observable<string>;

  ngOnInit(): void {
    this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(res=>{
      this.tituloPaginaPrincipal = res.titulo;
      this.logoPaginaPrincipal = res.logo;
      setTimeout(() => {
        this.load = true;
      }, 2000);
    });
      this.token = sessionStorage.getItem("ACCESS_TOKEN")
      if(this.token== 'undefined' || this.token == null){
        this.token = null;
      }else{
        this.token = sessionStorage.getItem("ACCESS_TOKEN")
        this.usuario = sessionStorage.getItem("USUARIO")
        this.fotoPerfil=sessionStorage.getItem("FOTO"); 
        this.usuarioService.obtenerUsuario(sessionStorage.getItem('ID')).subscribe(result=>{
          if(result.rol == '5ebb4bf7033d1300171f926d'){
            this.tipoUsuario = 1;
          }else{
            this.tipoUsuario = 2;
          }
        });
      }
    
    this.paginaService.obtenerPaginas().subscribe(res=>{
      for (let i = 0; i < res.length; i++) {
        if(res[i].estado == 'activa'){
          this.paginas.push(res[i]);
        }
      }     
    });
      
  }

  cambioDePagina(id):void{
    this.router.navigate([`pagina/${id+1}`]);
  }
  

  mostrarContrasena(){
    let elemento :any = document.getElementById('pass');
    if(elemento.type =='text'){
      elemento.type = "password";
    }else{
      elemento.type = "text";
    }
    
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
         this.estadoSesion = 1;
         this.estadoLogueado.emit(this.estadoSesion);
         this.token=this.usuarioService.getToken();
         this.usuario = sessionStorage.getItem("USUARIO");
         this.fotoPerfil = sessionStorage.getItem("FOTO");
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
        
        this.Toast.fire({
          icon: 'error',
          title: `${res.mensaje}`
        })
      }else{
        this.estadoSesion = 1;
        this.estadoLogueado.emit(this.estadoSesion);
        this.token=this.usuarioService.getToken();
        this.usuario = sessionStorage.getItem("USUARIO");
        this.fotoPerfil = sessionStorage.getItem("FOTO");
        this.router.navigate(['/admin']);
        this.modalService.dismissAll();
        this.tipoUsuario=2;
        this.Toast.fire({
          icon: 'success',
          title: `Bienvenido ${res.usuario}`
        })
        this.InicioSesionAdmin.reset();

      }
    });
  }
  
  logout(){
    this.usuarioService.logout();
    this.estadoSesion = 0;
    this.estadoLogueado.emit(this.estadoSesion);
    this.token = sessionStorage.getItem("ACCESS_TOKEN")
    this.usuario = sessionStorage.getItem("USUARIO")
    this.fotoPerfil = sessionStorage.getItem("FOTO"); 
    this.fotoSelect = sessionStorage.getItem("FOTO");
    this.router.navigate(['/principal']);
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
    this.opcionPerfilFoto=0;
    this.opcionPerfilInfo=1;
    this.opcionPerfil=1;
    this.usuarioService.obtenerUsuario(sessionStorage.getItem('ID')).subscribe(res=>{
      
      this.EditarInfoUsuario.controls['correo'].setValue(res.correo);
      this.EditarInfoUsuario.controls['usuario'].setValue(res.usuario);
      this.EditarInfoUsuario.controls['telefono'].setValue(res.telefono);
    });
  }

  fotoUsuarioLogueado():void{
    this.opcionPerfilFoto=2;
    this.opcionPerfilInfo=0;
    this.opcionPerfil=1;
  }

  fotoSeleccionada(event:HtmlInputEvent):void{
    const id = Math.random().toString(36).substring(2);
    if(event.target.files && event.target.files[0]){
      this.file = event.target.files[0];
      this.filePath = `multimedia/imagenes/imagen_${id}.png`;
      const ref = this.firestorage.ref(this.filePath);
      const task = this.firestorage.upload(this.filePath,this.file);
      this.uploadPorcent = task.percentageChanges();
      task.snapshotChanges().pipe( finalize(()=> this.urlImage = ref.getDownloadURL())).subscribe();
      //imagen previa
      const reader = new FileReader();
      reader.onload = e => this.fotoSelect = reader.result;
      reader.readAsDataURL(this.file);
    }
  }

  editarFoto():void{
    this.urlImage.subscribe(res=>{
       this.usuarioService.editarFotoPerfil(res).subscribe(result=>{
        this.usuarioService.obtenerUsuario(sessionStorage.getItem('ID')).subscribe(res=>{

          this.fotoPerfil=res.foto_perfil;
          sessionStorage.setItem("FOTO",this.fotoPerfil);
          this.modalService.dismissAll();

        })    
       })
    })

    
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
        size:'xs',
        centered:true
      }
    )
  }

  cerrarModal(){
    this.modalService.dismissAll();
  }

}
