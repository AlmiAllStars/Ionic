import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { Videojuego } from '../models/videojuego';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  recomendados: Videojuego[] = [];
  generos: { nombre: string; items: Videojuego[] }[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    // Cargar videojuegos desde la API al iniciar la página
    this.productoService.cargarVideojuegosDesdeAPI().subscribe((videojuegos) => {
      console.log(videojuegos);
      this.cargarRecomendados(videojuegos);
      console.log(this.recomendados);
      this.cargarGeneros(videojuegos);
      console.log(this.generos);
    });
  }

  cargarRecomendados(videojuegos: Videojuego[]) {
    // Seleccionar los primeros 2 videojuegos como recomendados
    this.recomendados = videojuegos.slice(0, 2);
  }

  cargarGeneros(videojuegos: Videojuego[]) {
    const generosMap = new Map<string, Videojuego[]>();

  
    videojuegos.forEach((videojuego) => {
      if (videojuego.genres) {
        videojuego.genres.forEach((genero) => {
          if (!generosMap.has(genero)) {
            generosMap.set(genero, []);
          }
          generosMap.get(genero)?.push(videojuego);
        });
      }
    });
  
    // Convertimos el Map a un array adecuado para el formato de `this.generos`
    this.generos = Array.from(generosMap, ([nombre, items]) => ({ nombre, items }));
  }

  cargarPagina(categoria: string) {
    // Lógica para cargar la página correspondiente según la categoría seleccionada
  }
}
