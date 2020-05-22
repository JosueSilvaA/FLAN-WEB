import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  URL_SERVER: string = 'https://api-flan.herokuapp.com'
  Subject = new BehaviorSubject(false);
  private token: string;
  private usuario:string;
  private id:string;

  constructor(private httpClient:HttpClient) { }
  //lOGIN DE LOS USUARIOS
  loginRegistrado(usuario): Observable<any>{
    let rol = "5ebb4bf7033d1300171f926d"
    return this.httpClient.post<any>(`${this.URL_SERVER}/login/registrado/${rol}`,usuario).
    pipe(tap(
      (res)=>{
        if(res){
          this.guardarToken(res.accessToken,res.expiresIn,res.id,res.usuario);
        }
      }
    ))
  }

  loginAdmin(usuario): Observable<any>{
    let rol = "5ebb4ccf033d1300171f926e"
    return this.httpClient.post<any>(`${this.URL_SERVER}/login/admin/${rol}`,usuario).
    pipe(tap(
      (res)=>{
        if(res){
          console.log("respuesta",res)
          this.guardarToken(res.accessToken,res.expiresIn,res.id,res.usuario);
        }
      }
    ))
  }

  logout():void{
    this.token = '';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USUARIO");
    localStorage.removeItem("ID");
    localStorage.removeItem("EXPIRES_IN");;
  }

  /////OPERACIONES CON EL USUARIO
  obtenerUsuarios():Observable<any>{
    return this.httpClient.get(`${this.URL_SERVER}/usuarios`);
  }

  eliminarUsuario(usuario):Observable<any>{
    return this.httpClient.delete(`${this.URL_SERVER}/usuarios/${usuario}`)
  }

  registrarUsuario(usuario):Observable<any>{
    return this.httpClient.post(`${this.URL_SERVER}/usuarios`,usuario);
  }


  //Gestion de los tokens
  guardarToken(token:string,expiresIn:string,id:string,usuario:string):void{
    localStorage.setItem("ACCESS_TOKEN",token);
    localStorage.setItem("EXPIRES_IN",expiresIn);
    localStorage.setItem("USUARIO",usuario);
    localStorage.setItem("ID",id);
    this.token= token;
  }

  getToken():string{
    if(!this.token){
      this.token=localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token;
  }

  getUsuario():string{
    if(!this.usuario){
      this.usuario=localStorage.getItem("USUARIO");
    }
    return this.usuario;
  }

  getId():string{
    if(!this.id){
      this.id=localStorage.getItem("ID");
    }
    return this.id;
  }
}

