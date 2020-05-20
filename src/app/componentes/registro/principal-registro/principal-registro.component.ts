import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators} from '@angular/forms/';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import  Swal  from 'sweetalert2'

@Component({
  selector: 'app-principal-registro',
  templateUrl: './principal-registro.component.html',
  styleUrls: ['./principal-registro.component.css']
})
export class PrincipalRegistroComponent implements OnInit {
  Toast:any = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  RegistroUsuario = new FormGroup({
    usuario : new FormControl('',[Validators.required]),
    nombres : new FormControl('',[Validators.required]),
    apellidos : new FormControl('',[Validators.required]),
    correo: new FormControl('',[Validators.required,Validators.email]),
    contrasena: new FormControl('',[Validators.required]),
    direccion: new FormControl('',[Validators.required]),
    telefono: new FormControl('',[Validators.required])
  });

  constructor(private usuarioServicio: UsuarioService,private router:Router) { }

  ngOnInit(): void {
  }
  //////////////////////
  registrar():void{
    this.usuarioServicio.registrarUsuario(this.RegistroUsuario.value).subscribe(res=>{
      if(res.code){
        this.Toast.fire({
          icon: 'error',
          title: `Este correo ya fue registrado`
        })
      }else{
        this.router.navigate(['/']);
        this.Toast.fire({
          icon: 'success',
          title: `Usuario Registrado`
        })
      }
    });
  }


  //gets del formGroup

  get usuario(){
    return this.RegistroUsuario.get('usuario');
  }

  get nombres(){
    return this.RegistroUsuario.get('nombres');
  }

  get apellidos(){
    return this.RegistroUsuario.get('apellidos');
  }

  get correo(){
    return this.RegistroUsuario.get('correo');
  }

  get contrasena(){
    return this.RegistroUsuario.get('contrasena');
  }

  get direccion(){
    return this.RegistroUsuario.get('direccion');
  }

  get telefono(){
    return this.RegistroUsuario.get('telefono');
  }
}
