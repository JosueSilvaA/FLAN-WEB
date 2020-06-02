import { Component, OnInit } from '@angular/core';
import { PaginaPrincipalService } from './../../../services/pagina-principal.service';
import { Observable } from 'rxjs';
import { FormControl,FormGroup,Validators} from '@angular/forms';
import { faPenAlt,faExclamation,faPlusSquare,faTrashAlt,faImages } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/src/sweetalert2.js'
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'

interface HtmlInputEvent extends Event{
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-admin-pagina-principal',
  templateUrl: './admin-pagina-principal.component.html',
  styleUrls: ['./admin-pagina-principal.component.css']
})
export class AdminPaginaPrincipalComponent implements OnInit {
  //////////////////////////////////
  faPenAlt = faPenAlt;
  faExclamation = faExclamation;
  faPlusSquare = faPlusSquare;
  faTrashAlt = faTrashAlt;
  faImages = faImages;
  //////////////////////////////////
  alerta:number = 1;
  alerta2:number = 2;
  //////////////////////////////////
  paginaPrincipal:any;
  imagenes:any = [];
  //////////////////////////////////
  fileFavicon : File;
  fileLogo:File;
  fotoSelectFavicon:string | ArrayBuffer;
  fotoSelectLogo:string | ArrayBuffer;
  filePath:string
  uploadPorcentFavicon: Observable<number>;
  uploadPorcentLogo: Observable<number>;
  urlImageFavicon: Observable<string>;
  urlImageLogo: Observable<string>;
  faviconSeleccionado:any;
  logoSeleccionado:any;
  ////////////////////////////////////////////
  file: File;
  fotoSelect:string | ArrayBuffer;
  uploadPorcent: Observable<number>;
  urlImage: Observable<string>;
  ///////////////////////////////////////////
  imagenSeleccionada:any;
  constructor(private paginaPrincipalService:PaginaPrincipalService,private modalService:NgbModal,private firestorage:AngularFireStorage) { }

  ngOnInit(): void {
    this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(res=>{
      this.paginaPrincipal = res;
      this.imagenes = res.imagenes;
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

  EditarInfoPrincipal = new FormGroup({
    titulo : new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(6)]),
    descripcion : new FormControl('',[Validators.required,Validators.minLength(15)]),
    piePagina: new FormControl('',[Validators.required,Validators.minLength(15),Validators.maxLength(30)])
  });

  NuevaImagen = new FormGroup({
    nombreImagen : new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
    descripcion : new FormControl('',[Validators.required,Validators.minLength(15),Validators.maxLength(40)])
  });

  get titulo(){
    return this.EditarInfoPrincipal.get('titulo');
  }

  get descripcion(){
    return this.EditarInfoPrincipal.get('descripcion');
  }

  get piePagina(){
    return this.EditarInfoPrincipal.get('piePagina');
  }

  get nombreI(){
    return this.NuevaImagen.get('nombreImagen');
  }

  get descripcionI(){
    return this.NuevaImagen.get('descripcion');
  }

  iniciarFormulario():void{
    this.EditarInfoPrincipal.controls['titulo'].setValue(this.paginaPrincipal.titulo);
    this.EditarInfoPrincipal.controls['descripcion'].setValue(this.paginaPrincipal.descripcion);
    this.EditarInfoPrincipal.controls['piePagina'].setValue(this.paginaPrincipal.piePagina);
  }

  setIdImagen(idImagen):void{
    this.NuevaImagen.reset();
    this.imagenSeleccionada = idImagen;
    this.obtenerInfoImagen(this.imagenSeleccionada);
  }

  obtenerInfoImagen(idImagen):void{
    console.log
    this.paginaPrincipalService.obtenerInfoImagen(idImagen,this.paginaPrincipal._id).subscribe(res=>{
      this.NuevaImagen.controls['nombreImagen'].setValue(res.nombreImagen);
      this.NuevaImagen.controls['descripcion'].setValue(res.descripcion);
    });
  }

  editarInformacion():void{
    console.log(this.EditarInfoPrincipal.value)
    this.paginaPrincipalService.editarInfoPaginaPrincipal(this.EditarInfoPrincipal.value,this.paginaPrincipal._id).subscribe(res=>{
      this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(res=>{
        this.paginaPrincipal = res;
        this.modalService.dismissAll();
        this.fotoSelectLogo= '';
        this.fotoSelectFavicon = '';
        this.Toast.fire({
          icon: 'success',
          title: `Se edito con exito`
        })
      });      
    });
  }

  editarLogos():void{
    this.urlImageFavicon.subscribe(favi=>{
      this.urlImageLogo.subscribe(logo=>{
        let logos ={
          favicon:favi,
          logo:logo
        }
        this.paginaPrincipalService.editarLogosPaginaPrincipal(logos,this.paginaPrincipal._id).subscribe(result=>{
          this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(res=>{
            this.paginaPrincipal = res;
            this.modalService.dismissAll();
            this.fotoSelectLogo= '';
            this.fotoSelectFavicon = '';
            this.Toast.fire({
              icon: 'success',
              title: `Se edito con exito`
            });
          });
        });
      });
    });
  }

  agregarImagen():void{
    this.urlImage.subscribe(url=>{
      let nuevaImagen ={
        nombreImagen:this.NuevaImagen.value.nombreImagen,
        descripcion:this.NuevaImagen.value.descripcion,
        url:url
      }
      this.paginaPrincipalService.nuevaImagen(nuevaImagen,this.paginaPrincipal._id).subscribe(res=>{
        this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(result=>{
          this.paginaPrincipal = result;
          this.imagenes = result.imagenes; 
          this.modalService.dismissAll();
          this.fotoSelect= '';
          
          this.Toast.fire({
            icon: 'success',
            title: `Se agrego con exito`
          })
          this.NuevaImagen.reset();
        });    
      });
      
    });
  }

  borrarImagen():void{
    console.log(this.imagenSeleccionada)
    this.paginaPrincipalService.eliminarImagen(this.imagenSeleccionada,this.paginaPrincipal._id).subscribe(res=>{
      this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(result=>{
        this.paginaPrincipal = result;
        this.imagenes = result.imagenes; 
        this.modalService.dismissAll();
        this.Toast.fire({
          icon: 'success',
          title: `Se elimino con exito`
        })
      });
    });
  }

  modificarImagen():void{
    this.paginaPrincipalService.editarImagen(this.NuevaImagen.value,this.imagenSeleccionada,this.paginaPrincipal._id).subscribe(res=>{
      this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(result=>{
        this.paginaPrincipal = result;
        this.imagenes = result.imagenes; 
        this.modalService.dismissAll();
        this.Toast.fire({
          icon: 'success',
          title: `Se edito con exito`
        })
        this.NuevaImagen.reset();
      });
    });
  }

  editarURL():void{
    this.urlImage.subscribe(url=>{
      console.log(url)
      let u ={
        url:url
      }
      this.paginaPrincipalService.editarURL(u,this.imagenSeleccionada,this.paginaPrincipal._id).subscribe(res=>{
        this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(result=>{
          console.log(res);
          this.paginaPrincipal = result;
          this.imagenes = result.imagenes; 
          this.modalService.dismissAll();
          this.fotoSelect= '';
          this.Toast.fire({
            icon: 'success',
            title: `Se edito con exito`
          })
        });    
      });
    });
  }

  fotoSeleccionadaFavicon(event:HtmlInputEvent):void{
    const id = Math.random().toString(36).substring(2);
    if(event.target.files && event.target.files[0]){
      this.fileFavicon = event.target.files[0];
      this.filePath = `multimedia/admin/imagenes/imagen_${id}.png`;
      const ref = this.firestorage.ref(this.filePath);
      const task = this.firestorage.upload(this.filePath,this.fileFavicon);
      this.uploadPorcentFavicon = task.percentageChanges();
      task.snapshotChanges().pipe( finalize(()=> this.urlImageFavicon = ref.getDownloadURL())).subscribe();
      //imagen previa
      const reader = new FileReader();
      reader.onload = e => this.fotoSelectFavicon = reader.result;
      reader.readAsDataURL(this.fileFavicon);
    }
  }

  fotoSeleccionadaLogo(event:HtmlInputEvent):void{
    const id = Math.random().toString(36).substring(2);
    if(event.target.files && event.target.files[0]){
      this.fileLogo = event.target.files[0];
      this.filePath = `multimedia/admin/imagenes/imagen_${id}.png`;
      const ref = this.firestorage.ref(this.filePath);
      const task = this.firestorage.upload(this.filePath,this.fileLogo);
      this.uploadPorcentLogo = task.percentageChanges();
      task.snapshotChanges().pipe( finalize(()=> this.urlImageLogo = ref.getDownloadURL())).subscribe();
      //imagen previa
      const reader = new FileReader();
      reader.onload = e => this.fotoSelectLogo = reader.result;
      reader.readAsDataURL(this.fileLogo);
    }
  }

  fotoNuevaSeleccionada(event:HtmlInputEvent):void{
    const id = Math.random().toString(36).substring(2);
    if(event.target.files && event.target.files[0]){
      this.file = event.target.files[0];
      this.filePath = `multimedia/admin/imagenes/paginaPrincipal/imagen_${id}.png`;
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

  abrirModal(modal:any){
    this.NuevaImagen.reset();
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
    this.fotoSelect = '';
    this.fotoSelectFavicon = '';
    this.fotoSelectLogo = '';
    this.NuevaImagen.reset();
  }

}
