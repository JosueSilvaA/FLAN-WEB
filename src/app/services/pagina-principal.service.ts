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
}
