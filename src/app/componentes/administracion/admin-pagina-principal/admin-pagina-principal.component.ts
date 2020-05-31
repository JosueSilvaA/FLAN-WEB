import { Component, OnInit } from '@angular/core';
import { PaginaPrincipalService } from './../../../services/pagina-principal.service';
import { Observable } from 'rxjs';
import { FormControl,FormGroup,Validators} from '@angular/forms';
import { faPenAlt,faExclamation } from '@fortawesome/free-solid-svg-icons';
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
  //////////////////////////////////
  alerta:number = 1;
  //////////////////////////////////
  paginaPrincipal:any;
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
  constructor(private paginaPrincipalService:PaginaPrincipalService,private modalService:NgbModal,private firestorage:AngularFireStorage) { }

  ngOnInit(): void {
    this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(res=>{
      console.log(res);
      this.paginaPrincipal = res;
      console.log(this.paginaPrincipal.imagenes.length);
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
  });

  get titulo(){
    return this.EditarInfoPrincipal.get('titulo');
  }

  get descripcion(){
    return this.EditarInfoPrincipal.get('descripcion');
  }

  editarInformacion():void{
    this.urlImageFavicon.subscribe(favi=>{
      this.urlImageLogo.subscribe(logo=>{
        let infoNueva = {
          favicon: favi,
          logo : logo,
          titulo : this.EditarInfoPrincipal.value.titulo,
          descripcion : this.EditarInfoPrincipal.value.descripcion
        }
        this.paginaPrincipalService.editarInfoPaginaPrincipal(infoNueva,this.paginaPrincipal._id).subscribe(res=>{
          console.log("respuesta de edicion ",res);
          this.modalService.dismissAll();
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

  abrirModal(modal:any){
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
