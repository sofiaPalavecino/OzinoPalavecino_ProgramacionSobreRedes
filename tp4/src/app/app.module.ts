import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButacaComponent } from './butaca/butaca.component';
import { SalaComponent } from './sala/sala.component';
import { ListadoComponent } from './listado/listado.component';
import { PeliculaComponent } from './pelicula/pelicula.component';


@NgModule({
  declarations: [
    AppComponent,
    ButacaComponent,
    SalaComponent,
    ListadoComponent,
    PeliculaComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
