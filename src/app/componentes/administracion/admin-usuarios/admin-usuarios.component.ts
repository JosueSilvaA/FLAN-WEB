import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { faTrashAlt,faPenAlt,faExclamationTriangle,faUnlock,faCamera } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2/src/sweetalert2.js'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage'
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';


interface HtmlInputEvent extends Event{
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  /////////
  faTrashAlt = faTrashAlt;
  faPenAlt = faPenAlt;
  faExclamation = faExclamationTriangle;
  faUnlock = faUnlock;
  faCamera = faCamera;

  constructor(private router:Router,private modalService:NgbModal,private usuarioService:UsuarioService,private firestorage:AngularFireStorage) { }

  roles:any =[];
  usuariosRegistrados:any = [];
  usuariosAdmins:any = [];
  rolUsuarioRegistrado:string;
  rolUsuarioAdmin:string;
  usuarioSeleccionado:string;
  alerta = 1;
  ////////////////////////
  opcionPerfil:number=0;
  opcionPerfilInfo:number=0;
  opcionPerfilFoto:number=0;
  file : File;
  fotoSelect:string | ArrayBuffer;
  filePath:string

  //////////////////////////////
  uploadPorcent: Observable<number>;
  urlImage: Observable<string>;

  ngOnInit(): void {
    this.usuarioService.obtenerRoles().subscribe(res=>{
      this.roles = res.roles
      this.rolUsuarioRegistrado = this.roles[0]._id;
      this.rolUsuarioAdmin = this.roles[1]._id
      this.usuarioService.obtenerUsuariosPorRol(this.rolUsuarioAdmin).subscribe(res=>{
        this.usuariosAdmins=res.usuarios;
        console.log(this.usuariosAdmins)
      });
      this.usuarioService.obtenerUsuariosPorRol(this.rolUsuarioRegistrado).subscribe(res=>{
        this.usuariosRegistrados=res.usuarios;
      })
    });
    
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

  EditarInfoUsuario = new FormGroup({
    correo : new FormControl('',[Validators.required,Validators.email]),
    usuario : new FormControl('',[Validators.required]),
    direccion : new FormControl('',[Validators.required,Validators.minLength(10)]),
    telefono  : new FormControl('',[Validators.required,Validators.minLength(8)]),
  });

  get correoP(){
    return this.EditarInfoUsuario.get('correo');
  }

  get usuarioP(){
    return this.EditarInfoUsuario.get('usuario');
  }

  get telefonoP(){
    return this.EditarInfoUsuario.get('telefono');
  }

  get direccionP(){
    return this.EditarInfoUsuario.get('direccion');
  }

  prueba():void{
    console.log(this.roles);
  }

  setUsuarioSeleccionado(idUsuario){
    this.usuarioSeleccionado=idUsuario;
    console.log(idUsuario);
  }

  getUsuarioSeleccionado():string{
    return this.usuarioSeleccionado;
  }

  eliminarUsuario(idUsuario):void{
    this.usuarioService.eliminarUsuario(idUsuario).subscribe(res=>{
      if(res.resultado.n==1){
        this.Toast.fire({
          icon: 'success',
          title: `${res.mensaje}`
        })
        this.usuarioService.obtenerUsuariosPorRol(this.rolUsuarioRegistrado)
        .subscribe(result=>{
          this.usuariosRegistrados=result.usuarios;
        });
      }else{
        this.Toast.fire({
          icon: 'error',
          title: `${res.mensaje}`
        })
      }
    });
    console.log(idUsuario);
  }

  infoUsuarioSeleccionado(idUsuario):void{
    console.log(idUsuario);
    this.opcionPerfilFoto=0;
    this.opcionPerfilInfo=1;
    this.opcionPerfil=1;
    this.usuarioSeleccionado = idUsuario;
    console.log(this.getUsuarioSeleccionado());
    this.usuarioService.obtenerUsuario(idUsuario).subscribe(res=>{
      console.log(res);
      this.EditarInfoUsuario.controls['correo'].setValue(res.correo);
      this.EditarInfoUsuario.controls['usuario'].setValue(res.usuario);
      this.EditarInfoUsuario.controls['telefono'].setValue(res.telefono);
      this.EditarInfoUsuario.controls['direccion'].setValue(res.direccion);
    });
  }

  editarInfoUsuario(){
    console.log(this.EditarInfoUsuario.value);
    this.usuarioService.editarUsuarioAdmin(this.usuarioSeleccionado,this.EditarInfoUsuario.value).subscribe(res=>{
      console.log(res);
      if(res.n==1){
        this.usuarioService.obtenerUsuariosPorRol(this.rolUsuarioRegistrado).subscribe(result=>{
          this.Toast.fire({
            icon: 'success',
            title: 'Se edito correctamente'
          })
          this.modalService.dismissAll();
          this.usuariosRegistrados=result.usuarios;
        });
      }
    })
  }

  //////////////////////////////
  fotoUsuarioSeleccionado(idUsuario){
    this.usuarioSeleccionado = idUsuario;
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
       this.usuarioService.editarFotoPerfilAdmin(this.usuarioSeleccionado,res).subscribe(result=>{
        if(result.n==1){
          this.usuarioService.obtenerUsuariosPorRol(this.rolUsuarioRegistrado).subscribe(resultado=>{
            this.Toast.fire({
              icon: 'success',
              title: 'Se edito correctamente'
            })
            this.modalService.dismissAll();
            this.usuariosRegistrados=resultado.usuarios;
          });
        }
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
