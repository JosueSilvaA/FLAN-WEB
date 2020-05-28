import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from '../app/componentes/landing/landing.component'
import { PrincipalComponent } from './componentes/landing/principal/principal.component';
import { HerramientasComponent } from './componentes/landing/herramientas/herramientas.component';
import { BlogComponent } from './componentes/landing/blog/blog.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AdministracionComponent } from './componentes/administracion/administracion.component';
import { PanelPrincipalComponent } from './componentes/administracion/panel-principal/panel-principal.component';
import { AdminUsuariosComponent } from './componentes/administracion/admin-usuarios/admin-usuarios.component';
import { AdminMediosComponent } from './componentes/administracion/admin-medios/admin-medios.component';
import { AdminPaginaPrincipalComponent } from './componentes/administracion/admin-pagina-principal/admin-pagina-principal.component';
import { AdminPaginasInformativasComponent } from './componentes/administracion/admin-paginas-informativas/admin-paginas-informativas.component';
import { AdminPostsComponent } from './componentes/administracion/admin-posts/admin-posts.component';
import { AdminTemasComponent } from './componentes/administracion/admin-temas/admin-temas.component';


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
  {path: 'admin',component: AdministracionComponent,
    children:[
      {path:'',component:PanelPrincipalComponent},
      {path:'usuarios',component:AdminUsuariosComponent},
      {path:'medios',component:AdminMediosComponent},
      {path:'pagina-principal',component:AdminPaginaPrincipalComponent},
      {path:'paginas-informativas',component:AdminPaginasInformativasComponent},
      {path:'posts',component:AdminPostsComponent},
      {path:'temas',component:AdminTemasComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
