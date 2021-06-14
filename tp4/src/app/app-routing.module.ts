import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalaComponent } from "./sala/sala.component";
import { ButacaComponent } from "./butaca/butaca.component";
import { PeliculaComponent } from "./pelicula/pelicula.component";
import { ListadoComponent } from "./listado/listado.component";

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
