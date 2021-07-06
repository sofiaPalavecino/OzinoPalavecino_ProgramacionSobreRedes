import { Component } from '@angular/core';
import { RestService } from './rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private RestService:RestService){}

  title = 'Cinema';

  ngOnInit(): void {
    this.cargarData();
  }

  public cargarData(){
    this.RestService.get('http://localhost:3000/funciones').subscribe(respuesta =>{
      console.log(respuesta);
    });
  }
}
