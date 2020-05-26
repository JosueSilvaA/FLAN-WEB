import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from '../app/componentes/landing/landing.component'
import { PrincipalComponent } from './componentes/landing/principal/principal.component';
import { HerramientasComponent } from './componentes/landing/herramientas/herramientas.component';
import { BlogComponent } from './componentes/landing/blog/blog.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AdmininistracionComponent } from './componentes/admininistracion/admininistracion.component';

const routes: Routes = [
  {path:'',component:LandingComponent,
    children:[
      {path:'',component:PrincipalComponent},
      {path:'herramientas',component:HerramientasComponent},
      {path:'principal',component:PrincipalComponent},
      {path:'blog',component:BlogComponent}
    ]
  },
  {path:'registroUsuario',component:RegistroComponent},
  {path: 'admin',component: AdmininistracionComponent,
    children:[
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
