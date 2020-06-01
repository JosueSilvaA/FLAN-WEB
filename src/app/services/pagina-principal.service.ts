import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PaginaPrincipalService {
  URL_SERVER: string = 'https://api-flan.herokuapp.com'
  constructor(private httpClient:HttpClient) { }

  obtenerPaginaPrincipal():Observable<any>{
    return this.httpClient.get(`${this.URL_SERVER}/paginaPrincipal`)
  }

  editarInfoPaginaPrincipal(infoNueva,idPagina):Observable<any>{
    return this.httpClient.put(`${this.URL_SERVER}/paginaPrincipal/${idPagina}`,infoNueva);
  }

  editarLogosPaginaPrincipal(nuevosLogos,idPagina):Observable<any>{
    return this.httpClient.put(`${this.URL_SERVER}/paginaPrincipal/${idPagina}/logos`,nuevosLogos);
  }

  nuevaImagen(nuevaImagen,idPagina):Observable<any>{
    return this.httpClient.post(`${this.URL_SERVER}/paginaPrincipal/${idPagina}/imagenes`,nuevaImagen);
  }
  eliminarImagen(idImagen,idPagina):Observable<any>{
    return this.httpClient.delete(`${this.URL_SERVER}/paginaPrincipal/${idPagina}/imagenes/${idImagen}`);
  }

  editarImagen(nuevaInfo,idImagen,idPagina):Observable<any>{
    return this.httpClient.put(`${this.URL_SERVER}/paginaPrincipal/${idPagina}/imagenes/${idImagen}`,nuevaInfo);
  }

  editarURL(nuevaURL,idImagen,idPagina):Observable<any>{
    return this.httpClient.put(`${this.URL_SERVER}/paginaPrincipal/${idPagina}/imagenes/${idImagen}/imagen`,nuevaURL);
  }

  obtenerInfoImagen(idImagen,idPagina):Observable<any>{
    return this.httpClient.get(`${this.URL_SERVER}/paginaPrincipal/${idPagina}/imagenes/${idImagen}`);
  }
}

