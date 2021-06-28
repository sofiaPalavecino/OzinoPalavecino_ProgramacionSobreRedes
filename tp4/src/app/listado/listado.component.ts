import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {
  

  constructor() { }
  peliculas=["assets/images/space.jpeg","assets/images/emoji.jpg"]

  ngOnInit(): void {
  }

}
