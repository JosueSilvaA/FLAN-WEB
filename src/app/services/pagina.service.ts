import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PaginaService {
  URL_SERVER: string = 'https://api-flan.herokuapp.com/paginas'
  constructor(private httpClient:HttpClient) { }

  obtenerPaginas():Observable<any>{
    return this.httpClient.get(`${this.URL_SERVER}/`);
  }

  obtenerPagina(idPagina):Observable<any>{
    return this.httpClient.get(`${this.URL_SERVER}/${idPagina}`);
  }

  nuevaPagina(nuevaPagina):Observable<any>{
    return this.httpClient.post(`${this.URL_SERVER}/`,nuevaPagina);
  }

  eliminarPagina(idPagina):Observable<any>{
    return this.httpClient.delete(`${this.URL_SERVER}/${idPagina}`);
  }

  editarPagina(nuevaInfo,idPagina):Observable<any>{
    return this.httpClient.put(`${this.URL_SERVER}/${idPagina}`,nuevaInfo);
  }

  cambiarVisualizacion(nuevaVisualizacion,idPagina):Observable<any>{
    return this.httpClient.put(`${this.URL_SERVER}/${idPagina}/visualizacion`,nuevaVisualizacion);
  }

  cambiarEstado(nuevoEstado,idPagina):Observable<any>{
    return this.httpClient.put(`${this.URL_SERVER}/${idPagina}/estado`,nuevoEstado);
  }

  nuevoContenido(nuevoContenido,idPagina):Observable<any>{
    return this.httpClient.post(`${this.URL_SERVER}/${idPagina}/contenido`,nuevoContenido);
  }

  borrarContenido(idContenido,idPagina):Observable<any>{
    return this.httpClient.delete(`${this.URL_SERVER}/${idPagina}/contenido/${idContenido}`);
  }

  editarContenido(nuevoContenido,idContenido,idPagina):Observable<any>{
    return this.httpClient.put(`${this.URL_SERVER}/${idPagina}/contenido/${idContenido}`,nuevoContenido);
  }

  obtenerContenido(idContenido,idPagina):Observable<any>{
    return this.httpClient.get(`${this.URL_SERVER}/${idPagina}/contenido/${idContenido}`);
  }

  obtenerImagen(idImagen,idPagina):Observable<any>{
    return this.httpClient.get(`${this.URL_SERVER}/${idPagina}/imagenes/${idImagen}`);
  }

  nuevaImagen(nuevaImagen,idPagina):Observable<any>{
    return this.httpClient.post(`${this.URL_SERVER}/${idPagina}/imagenes`,nuevaImagen);
  }

  eliImagen(idImagen,idPagina):Observable<any>{
    return this.httpClient.delete(`${this.URL_SERVER}/${idPagina}/imagenes/${idImagen}`);
  }

  editarImagen(nuevaInfo,idImagen,idPagina):Observable<any>{
    return this.httpClient.put(`${this.URL_SERVER}/${idPagina}/imagenes/${idImagen}`,nuevaInfo);
  }

  editarURL(url,idImagen,idPagina):Observable<any>{
    return this.httpClient.put(`${this.URL_SERVER}/${idPagina}/imagenes/${idImagen}/imagen`,url)
  }
}
