import { Component, OnInit } from '@angular/core';
import { faTools,faBusinessTime,faUserSecret,faScroll} from '@fortawesome/free-solid-svg-icons'
import { PaginaPrincipalService } from './../../../services/pagina-principal.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  faTools = faTools;
  faBusinessTime = faBusinessTime;
  faUserSecret = faUserSecret;
  faScroll = faScroll;
  public load: boolean;
  constructor(private paginaPrincipalService:PaginaPrincipalService,private _sanitizer: DomSanitizer) {
    this.load = false;
   }

  ///////////////////////////
  descripcionPaginaPrincipal:any;
  imagenesPrincipales:any;
  imagenesSecundarias:any = [];
  fondoPrincipal:any;
  fondoTestimonial:any;
  favicon:any;
  ngOnInit(): void {
    this.paginaPrincipalService.obtenerPaginaPrincipal().subscribe(res=>{
      this.descripcionPaginaPrincipal = res.descripcion;
      this.imagenesPrincipales = res.imagenes;
      this.favicon = res.favicon;
      this.experimento();
      setTimeout(() => {
        this.load = true;
      }, 2000);
    });
  }

  experimento():void{
    for (let index = 0; index < this.imagenesPrincipales.length; index++) {
      if (this.imagenesPrincipales[index].nombreImagen =='Principal'){
        this.fondoPrincipal = this.imagenesPrincipales[index].url;
      }

      if (this.imagenesPrincipales[index].nombreImagen =='Testimonial'){
        this.fondoTestimonial = this.imagenesPrincipales[index].url;
      }

      if(this.imagenesPrincipales[index].nombreImagen !='Testimonial' && this.imagenesPrincipales[index].nombreImagen !='Principal'){
        this.imagenesSecundarias.push(this.imagenesPrincipales[index]);
      }
    }
  }

  public sanitizeImage(image: string) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

}
