import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage {
  rutaActual = 'videojuegos'; // Valor inicial

  constructor(private router: Router,  private route: ActivatedRoute ) {}



  cambiarPagina(ruta: string) {
    if (!ruta) return;
    this.rutaActual = ruta;
    this.router.navigate([ruta], { relativeTo: this.route });
  }

  convertirACadena(valor: any): string {
    return String(valor || '');
  }
  
}
