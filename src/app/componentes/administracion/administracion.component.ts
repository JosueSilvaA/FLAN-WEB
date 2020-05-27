import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '../../../app/services/usuario.service'
import Swal from 'sweetalert2/src/sweetalert2.js'
import { AngularFireStorage } from '@angular/fire/storage'
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { faExclamationTriangle,faUnlock } from '@fortawesome/free-solid-svg-icons'
import { faUser,faPhotoVideo,faFileCode,faComments,faPalette,faArrowAltCircleLeft,faArrowAltCircleRight,faExclamation } from '@fortawesome/free-solid-svg-icons'


interface HtmlInputEvent extends Event{
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {

  ///ICONOS DEL COMPONENTE
  faUser= faUser;
  faPhotoVideo = faPhotoVideo;
  faFileCode = faFileCode;
  faComments = faComments;
  faPalette = faPalette;
  faArrowAltCircleLeft = faArrowAltCircleLeft;
  faArrowAltCircleRight = faArrowAltCircleRight
  faExclamation = faExclamation;
  //////////////////////////
  token:string=null;
  usuario:string;
  fotoPerfil:string;
  public isMenuCollapsed = true;
  opcionPerfil:number=0;
  opcionPerfilInfo:number=0;
  opcionPerfilFoto:number=0;
  file : File;
  fotoSelect:string | ArrayBuffer;
  filePath:string
  cambio:number=0;
  //////////////////
  uploadPorcent: Observable<number>;
  urlImage: Observable<string>;

  constructor(private router:Router,private modalService:NgbModal,private usuarioService:UsuarioService,private firestorage:AngularFireStorage) { }

  ngOnInit(): void {
    this.token = sessionStorage.getItem("ACCESS_TOKEN")
      if(this.token== 'undefined'){
        this.token = null;
        this.router.navigate(['/'])
      }else{
        this.token = sessionStorage.getItem("ACCESS_TOKEN")
        this.usuario = sessionStorage.getItem("USUARIO")
        this.fotoPerfil=sessionStorage.getItem("FOTO"); 
      }
  }

  EditarInfoUsuario = new FormGroup({
    correo : new FormControl('',[Validators.required,Validators.email]),
    usuario : new FormControl('',[Validators.required]),
    contrasena : new FormControl('',[Validators.required]),
    telefono  : new FormControl('',[Validators.required,Validators.minLength(8)]),
  });

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

  
  ocultarSidebar(){
    if(this.cambio==0){
      this.cambio=1;
    }else{
      this.cambio=0
    }
  } 

  logout(){
    this.usuarioService.logout();
    this.token = sessionStorage.getItem("ACCESS_TOKEN")
    this.usuario = sessionStorage.getItem("USUARIO")
    this.fotoPerfil = sessionStorage.getItem("FOTO"); 
    this.fotoSelect = sessionStorage.getItem("FOTO");
    this.router.navigate(['/principal']);
  } 

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
