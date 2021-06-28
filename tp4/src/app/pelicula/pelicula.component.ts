import { Component, Input } from '@angular/core';

@Component({
  selector: 'pelicula',
  templateUrl: './pelicula.component.html',
  styleUrls: ['./pelicula.component.scss']
})
export class PeliculaComponent {

  constructor() { }
  @Input() valor:string = ''; 

}
