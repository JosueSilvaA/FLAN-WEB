import { Component, OnInit } from '@angular/core';
import { PaginaService } from '../../../services/pagina.service';
import { Observable } from 'rxjs';
import { faPlusSquare,faTrashAlt,faPen,faSync,faEye,faExclamation,faArrowLeft,faImages,faPenAlt } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/src/sweetalert2.js'
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { FormControl,FormGroup,Validators } from '@angular/forms';


interface HtmlInputEvent extends Event{
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-admin-informativas',
  templateUrl: './admin-informativas.component.html',
  styleUrls: ['./admin-informativas.component.css']
})
export class AdminInformativasComponent implements OnInit {
  /////////////////////////
  faPlusSquare = faPlusSquare;
  faTrashAlt = faTrashAlt;
  faPen = faPen;
  faSync = faSync;
  faEye = faEye;
  faExclamation = faExclamation;
  faArrowLeft = faArrowLeft;
  faImages = faImages;
  faPenAlt = faPenAlt;
  /////////////////////////
  alerta:number = 1;
  /////////////////////////
  paginas:any = [];
  pagina:any;
  idPaginaSeleccionada:any;
  /////////////////////////////
  contenidoPorPagina:any = [];
  idContenidoSeleccionado:any;
  contenido:any;
  /////////////////////////
  imagenes:any = [];
  ////////////////////////
  navegacion:number=0;
  navegacionImagen:number = 0;
  ////////////////////////
  file: File;
  fotoSelect:string | ArrayBuffer;
  uploadPorcent: Observable<number>;
  urlImage: Observable<string>;
  imagenSeleccionada:any;
  filePath:string
  /////////////////////////////
  Toast:any = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  constructor(private paginaService:PaginaService,private modalService:NgbModal,private firestorage:AngularFireStorage) { }

  NuevaPagina = new FormGroup({
    titulo : new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(10)]),
    descripcion : new FormControl('',[Validators.required,Validators.minLength(15)]),
    encabezado: new FormControl('',[Validators.required,Validators.minLength(15),Validators.maxLength(30)]),
    piePagina: new FormControl('',[Validators.required,Validators.minLength(15),Validators.maxLength(30)]),
    visualizacion: new FormControl('',[Validators.required])
  });

  EditarPagina = new FormGroup({
    titulo : new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(10)]),
    descripcion : new FormControl('',[Validators.required,Validators.minLength(15)]),
    encabezado: new FormControl('',[Validators.required,Validators.minLength(15),Validators.maxLength(30)]),
    piePagina: new FormControl('',[Validators.required,Validators.minLength(15),Validators.maxLength(30)]),
  });

  EditarVisualizacion = new FormGroup({
    visualizacion : new FormControl('',[Validators.required])
  });

  EditarEstado = new FormGroup({
    estado : new FormControl('',[Validators.required])
  });

  Contenido = new FormGroup({
    informacion:new FormControl('',[Validators.required,Validators.minLength(100)])
  });

  NuevaImagen = new FormGroup({
    nombreImagen : new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
    descripcion : new FormControl('',[Validators.required,Validators.minLength(15),Validators.maxLength(40)])
  });

  /////////////////////////////////////////////////
  get titulo(){
    return this.NuevaPagina.get('titulo');
  }

  get descripcion(){
    return this.NuevaPagina.get('descripcion');
  }

  get encabezado(){
    return this.NuevaPagina.get('encabezado');
  }

  get piePagina(){
    return this.NuevaPagina.get('piePagina');
  }

  get visualizacion(){
    return this.NuevaPagina.get('visualizacion');
  }

  /////////////////////////////////////////////////////
  
  get tituloN(){
    return this.EditarPagina.get('titulo');
  }

  get descripcionN(){
    return this.EditarPagina.get('descripcion');
  }

  get encabezadoN(){
    return this.EditarPagina.get('encabezado');
  }

  get piePaginaN(){
    return this.EditarPagina.get('piePagina');
  }

  //////////////////////////////////////////////////////////

  get visualizacionC(){
    return this.EditarVisualizacion.get('visualizacion');
  }

  /////////////////////////////////////////////////////////

  get estado(){
    return this.EditarEstado.get('estado');
  }

  ///////////////////////////////////////////////////////////
  get informacion(){
    return this.Contenido.get('informacion');
  }
  //////////////////////////////////////////////////////////
  get nombreI(){
    return this.NuevaImagen.get('nombreImagen');
  }

  get descripcionI(){
    return this.NuevaImagen.get('descripcion');
  }
  //////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.paginaService.obtenerPaginas().subscribe(res=>{
      for (let i = 0; i < res.length; i++) {
        if (res[i].tipo=='informativa') {
          this.paginas.push(res[i]);
          console.log(this.paginas)
        }
      }
    });
  }

  setPaginaSeleccionada(idPagina):void{
    this.navegacion = 1;
    this.navegacionImagen = 2;
    this.idPaginaSeleccionada = idPagina;
    this.cargarInformacion(idPagina);
    console.log(this.idPaginaSeleccionada);
  }

  setContenidoSeleccionado(idContenido):void{
    this.idContenidoSeleccionado = idContenido;
    this.cargarInformacionContenido(idContenido);
  }

  setIdImagen(idImagen):void{
    console.log('id de imagen ',idImagen)
    this.NuevaImagen.reset();
    this.imagenSeleccionada = idImagen;
    this.obtenerInfoImagen(this.imagenSeleccionada);
  }

  cargarInformacion(idPagina):void{
    this.paginaService.obtenerPagina(idPagina).subscribe(res=>{
      this.EditarPagina.controls['titulo'].setValue(res.titulo);
      this.EditarPagina.controls['descripcion'].setValue(res.descripcion);
      this.EditarPagina.controls['encabezado'].setValue(res.encabezado);
      this.EditarPagina.controls['piePagina'].setValue(res.piePagina);
      this.pagina = res;
      this.contenidoPorPagina = res.contenido;
      this.imagenes = res.imagenes;
    });
  }

  cargarInformacionContenido(idContenido):void{
    this.paginaService.obtenerContenido(idContenido,this.idPaginaSeleccionada).subscribe(res=>{
      this.Contenido.controls['informacion'].setValue(res.informacion);
    });
  }

  

  obtenerInfoImagen(idImagen):void{
    
    this.paginaService.obtenerImagen(idImagen,this.idPaginaSeleccionada).subscribe(res=>{
      console.log('imagen seleccionada ',idImagen, 'PAGINA SELECCIONADA ',this.idPaginaSeleccionada);
      console.log('INFO DE LA IMAGEN',res)
      this.NuevaImagen.controls['nombreImagen'].setValue(res.nombreImagen);
      this.NuevaImagen.controls['descripcion'].setValue(res.descripcion);
    });
  }
  
  prueba():void{
    console.log(this.idPaginaSeleccionada)
  }

  agregarPagina():void{
    let nuevaPagina = {
      titulo: this.NuevaPagina.value.titulo,
      descripcion: this.NuevaPagina.value.descripcion,
      encabezado: this.NuevaPagina.value.encabezado,
      piePagina: this.NuevaPagina.value.piePagina,
      visualizacion: this.NuevaPagina.value.visualizacion,
      tipo: 'informativa'
    }

    this.paginaService.nuevaPagina(nuevaPagina).subscribe(result=>{
      this.paginaService.obtenerPaginas().subscribe(res=>{
        this.paginas = [];
        for (let i = 0; i < res.length; i++) {
          
          if (res[i].tipo=='informativa') {
            this.Toast.fire({
              icon: 'success',
              title: `Se agrego una pagina informativa`
            });
            this.paginas.push(res[i]);
            this.modalService.dismissAll();
          }
        }
      });
    });
  }

  borrarPagina():void{
    this.paginaService.eliminarPagina(this.idPaginaSeleccionada).subscribe(result=>{
      this.paginaService.obtenerPaginas().subscribe(res=>{
        this.paginas = [];
        for (let i = 0; i < res.length; i++) {
          
          if (res[i].tipo=='informativa') {
            this.Toast.fire({
              icon: 'success',
              title: `Eliminada la página con exito`
            });
            this.paginas.push(res[i]);
            this.modalService.dismissAll();
          }
        }
      });
    });
  }

  modificarPagina():void{
    this.paginaService.editarPagina(this.EditarPagina.value,this.idPaginaSeleccionada).subscribe(result=>{
      this.paginaService.obtenerPaginas().subscribe(res=>{
        this.paginas = [];
        for (let i = 0; i < res.length; i++) {
          
          if (res[i].tipo=='informativa') {
            this.Toast.fire({
              icon: 'success',
              title: `Editada la página con exito`
            });
            this.paginas.push(res[i]);
            this.modalService.dismissAll();
          }
        }
      });
    });
  }

  cambiarVisualizacion():void{
    this.paginaService.cambiarVisualizacion(this.EditarVisualizacion.value,this.idPaginaSeleccionada).subscribe(result=>{
      this.paginaService.obtenerPaginas().subscribe(res=>{
        this.paginas = [];
        for (let i = 0; i < res.length; i++) {
          
          if (res[i].tipo=='informativa') {
            this.Toast.fire({
              icon: 'success',
              title: `Editada la visualizacion con exito`
            });
            this.paginas.push(res[i]);
            this.modalService.dismissAll();
          }
        }
      });
    });
  }

  cambiarEstado():void{
    this.paginaService.cambiarEstado(this.EditarEstado.value,this.idPaginaSeleccionada).subscribe(result=>{
      this.paginaService.obtenerPaginas().subscribe(res=>{
        this.paginas = [];
        for (let i = 0; i < res.length; i++) {
          
          if (res[i].tipo=='informativa') {
            this.Toast.fire({
              icon: 'success',
              title: `Estado de la pagina: ${this.EditarEstado.value.estado}`
            });
            this.paginas.push(res[i]);
            this.modalService.dismissAll();
          }
        }
      });
    });
  }

  nuevoContenido():void{
    this.paginaService.nuevoContenido(this.Contenido.value,this.idPaginaSeleccionada).subscribe(result=>{
      this.paginaService.obtenerPagina(this.idPaginaSeleccionada).subscribe(respuesta=>{
        this.paginaService.obtenerPaginas().subscribe(res=>{
          this.paginas = [];
          this.contenidoPorPagina = [];
          this.pagina = respuesta
          this.contenidoPorPagina = respuesta.contenido;
          
          this.Toast.fire({
            icon: 'success',
            title: `Se agrego un nuevo contenido a la pagina ${this.pagina.titulo}`
          });
          for (let i = 0; i < res.length; i++) {
            
            if (res[i].tipo=='informativa') {
              
              this.paginas.push(res[i]);
              this.modalService.dismissAll();
            }
          }
        });
      });
    });
  }

  borrarContenido():void{
    this.paginaService.borrarContenido(this.idContenidoSeleccionado,this.idPaginaSeleccionada).subscribe(result=>{
      this.paginaService.obtenerPagina(this.idPaginaSeleccionada).subscribe(respuesta=>{
        this.paginaService.obtenerPaginas().subscribe(res=>{
          this.paginas = [];
          this.contenidoPorPagina = [];
          this.pagina = respuesta
          this.contenidoPorPagina = respuesta.contenido;
          
          this.Toast.fire({
            icon: 'success',
            title: `Se elimino un  contenido de la pagina ${this.pagina.titulo}`
          });
          for (let i = 0; i < res.length; i++) {
            
            if (res[i].tipo=='informativa') {
              
              this.paginas.push(res[i]);
              this.modalService.dismissAll();
            }
          }
        });
      });
    });
  }


  modificarContenido():void{
    this.paginaService.editarContenido(this.Contenido.value,this.idContenidoSeleccionado,this.idPaginaSeleccionada).subscribe(result=>{
      this.paginaService.obtenerPagina(this.idPaginaSeleccionada).subscribe(respuesta=>{
        this.paginaService.obtenerPaginas().subscribe(res=>{
          this.paginas = [];
          this.contenidoPorPagina = [];
          this.pagina = respuesta
          this.contenidoPorPagina = respuesta.contenido;
          
          this.Toast.fire({
            icon: 'success',
            title: `Se elimino un  contenido de la pagina ${this.pagina.titulo}`
          });
          for (let i = 0; i < res.length; i++) {
            
            if (res[i].tipo=='informativa') {
              
              this.paginas.push(res[i]);
              this.modalService.dismissAll();
            }
          }
        });
      });
    });
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

  agregarImagen():void{
    this.urlImage.subscribe(url=>{
      let nuevaImagen ={
        nombreImagen:this.NuevaImagen.value.nombreImagen,
        descripcion:this.NuevaImagen.value.descripcion,
        url:url
      }
      this.paginaService.nuevaImagen(nuevaImagen,this.idPaginaSeleccionada).subscribe(result=>{
        this.paginaService.obtenerPagina(this.idPaginaSeleccionada).subscribe(respuesta=>{
          this.paginaService.obtenerPaginas().subscribe(res=>{
            this.paginas = [];
            this.imagenes = [];
            this.pagina = respuesta
            this.imagenes = respuesta.imagenes;
            
            this.Toast.fire({
              icon: 'success',
              title: `Se agrego una imagen a la pagina ${this.pagina.titulo}`
            });
            for (let i = 0; i < res.length; i++) {
              
              if (res[i].tipo=='informativa') {
                
                this.paginas.push(res[i]);
                this.modalService.dismissAll();
              }
            }
          });
        });
      }) 
    });
  }

  borrarImagen():void{
    console.log('Imagen Seleccionada',this.imagenSeleccionada)
    console.log('Pagina Seleccionada ',this.idPaginaSeleccionada)
    this.paginaService.eliImagen(this.imagenSeleccionada,this.idPaginaSeleccionada).subscribe(resultado=>{
      this.paginaService.obtenerPagina(this.idPaginaSeleccionada).subscribe(respuesta=>{
        this.paginaService.obtenerPaginas().subscribe(res=>{
          this.paginas = [];
          this.imagenes = [];
          this.pagina = respuesta
          this.imagenes = respuesta.imagenes;
          
          this.Toast.fire({
            icon: 'success',
            title: `Se elimino una imagen de la pagina ${this.pagina.titulo}`
          });
          for (let i = 0; i < res.length; i++) {
            
            if (res[i].tipo=='informativa') {
              
              this.paginas.push(res[i]);
              this.modalService.dismissAll();
            }
          }
        });
      });
    });
  }

  modificarImagen():void{
    this.paginaService.editarImagen(this.NuevaImagen.value,this.imagenSeleccionada,this.idPaginaSeleccionada).subscribe(resultado=>{
      this.paginaService.obtenerPagina(this.idPaginaSeleccionada).subscribe(respuesta=>{
        this.paginaService.obtenerPaginas().subscribe(res=>{
          this.paginas = [];
          this.imagenes = [];
          this.pagina = respuesta
          this.imagenes = respuesta.imagenes;
          
          this.Toast.fire({
            icon: 'success',
            title: `Se modifico una imagen de la pagina ${this.pagina.titulo}`
          });
          for (let i = 0; i < res.length; i++) {
            
            if (res[i].tipo=='informativa') {
              
              this.paginas.push(res[i]);
              this.modalService.dismissAll();
            }
          }
        });
      });
    });
  }

  editarURL():void{
    this.urlImage.subscribe(url=>{
      console.log(url)
      let u ={
        url:url
      }
      this.paginaService.editarURL(u,this.imagenSeleccionada,this.idPaginaSeleccionada).subscribe(resultado=>{
        this.paginaService.obtenerPagina(this.idPaginaSeleccionada).subscribe(respuesta=>{
          this.paginaService.obtenerPaginas().subscribe(res=>{
            this.paginas = [];
            this.imagenes = [];
            this.pagina = respuesta
            this.imagenes = respuesta.imagenes;
            
            this.Toast.fire({
              icon: 'success',
              title: `Se edito una imagen de la pagina ${this.pagina.titulo}`
            });
            for (let i = 0; i < res.length; i++) {
              
              if (res[i].tipo=='informativa') {
                
                this.paginas.push(res[i]);
                this.modalService.dismissAll();
              }
            }
          });
        });   
      });
    });
  }
  abrirModal(modal:any){
    this.modalService.open(
        modal,
        {
          size:'xs',
          centered:true
        }
      )
  }

  abrirModalContenido(modal:any){
    this.modalService.open(
        modal,
        {
          size:'lg',
          centered:false
        }
      )
  }

  cerrarModal(){
    this.modalService.dismissAll();
    this.NuevaPagina.reset();
  }

}
