import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LandingComponent } from './componentes/landing/landing.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { HeaderPrincipalComponent } from './componentes/landing/header-principal/header-principal.component';
import { BlogComponent } from './componentes/landing/blog/blog.component';
import { FooterPrincipalComponent } from './componentes/landing/footer-principal/footer-principal.component';
import { HerramientasComponent } from './componentes/landing/herramientas/herramientas.component';
import { PrincipalComponent } from './componentes/landing/principal/principal.component';
import { HeaderRegistroComponent } from './componentes/registro/header-registro/header-registro.component';
import { PrincipalRegistroComponent } from './componentes/registro/principal-registro/principal-registro.component';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RegistroComponent,
    HeaderPrincipalComponent,
    BlogComponent,
    FooterPrincipalComponent,
    HerramientasComponent,
    PrincipalComponent,
    HeaderRegistroComponent,
    PrincipalRegistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
