import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators} from '@angular/forms/';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import  Swal  from 'sweetalert2'
import '@sweetalert2/theme-borderless'
import { faExclamationTriangle,faUnlock} from '@fortawesome/free-solid-svg-icons'

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
    usuario : new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(15)]),
    nombres : new FormControl('',[Validators.required]),
    apellidos : new FormControl('',[Validators.required]),
    correo: new FormControl('',[Validators.required,Validators.email]),
    contrasena: new FormControl('',[Validators.required]),
    direccion: new FormControl('',[Validators.required,Validators.minLength(10)]),
    telefono: new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(10),Validators.pattern(/^-?(0|[1-9]\d*)?$/)])
  });

  constructor(private usuarioServicio: UsuarioService,private router:Router) { }

  faExclamation = faExclamationTriangle;
  faUnlock = faUnlock;
  ngOnInit(): void {
  }

  mostrarContrasena(){
    let elemento :any = document.getElementById('pass');
    if(elemento.type =='text'){
      elemento.type = "password";
    }else{
      elemento.type = "text";
    }
    
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
