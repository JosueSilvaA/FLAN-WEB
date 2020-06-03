import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaginaService } from 'src/app/services/pagina.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-estaticas',
  templateUrl: './estaticas.component.html',
  styleUrls: ['./estaticas.component.css']
})
export class EstaticasComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute,private paginaService:PaginaService,private _sanitizer: DomSanitizer) {
    this.load = false;
   }

  idPagina:any;
  paginas:any = []
  paginaActual:any;
  contenidos:any = [];
  imagenes:any = [];
  public load: boolean;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params =>{
      if(params.has("id")){
        this.idPagina = params.get('id');
        this.paginaService.obtenerPaginas().subscribe(resultado=>{
          this.paginas = resultado;
          this.paginaActual = this.paginas[this.idPagina-1];
          this.contenidos = this.paginaActual.contenido;
          this.imagenes = this.paginaActual.imagenes;
          setTimeout(() => {
            this.load = true;
          }, 2000);
        });
      }
    });
  }

  public sanitizeImage(image: string) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

}
