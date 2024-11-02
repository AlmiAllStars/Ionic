import { Component, HostListener, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Videojuego } from '../../models/videojuego';
import { Consola } from '../../models/consola';
import { Dispositivo } from '../../models/dispositivo';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-videojuegos',
  templateUrl: './videojuegos.component.html',
  styleUrls: ['./videojuegos.component.scss'],
})
export class VideojuegosComponent  implements OnInit {
  recomendados: Videojuego[] = [];
  generos: { nombre: string; items: Videojuego[] }[] = [];
  resultadosBusqueda: Videojuego[] = [];
  seccionActual = 'videojuegos';

  isScrolled = false;
  lastScrollTop = 0;

  constructor(private productoService: ProductoService, private router: Router) {}

  ngOnInit() {
    // Cargar datos de videojuegos
    this.productoService.cargarVideojuegosDesdeAPI().subscribe((videojuegos) => {
      this.cargarRecomendados(videojuegos);
      this.cargarGeneros(videojuegos);
    });
    
  }

  cargarRecomendados(videojuegos: Videojuego[]) {
    this.recomendados = videojuegos.slice(videojuegos.length - 6);
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
    this.generos = Array.from(generosMap, ([nombre, items]) => ({ nombre, items }));
  }

  // Función de búsqueda para filtrar videojuegos por nombre
  buscar(event: any) {
    const query = event.target.value.toLowerCase();
    if (query && query.trim() !== '') {
      this.productoService.cargarVideojuegosDesdeAPI().subscribe((videojuegos) => {
        this.resultadosBusqueda = videojuegos.filter((videojuego) =>
          videojuego.name.toLowerCase().includes(query)
        );
      });
    } else {
      this.resultadosBusqueda = [];
    }
  }

  // Detectar el scroll y ocultar/mostrar el menú según la dirección
  @HostListener('window:scroll', [])
  onWindowScroll() {
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.isScrolled = currentScrollTop > this.lastScrollTop;
    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }

  async verDetalles(producto: Videojuego) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        producto: JSON.stringify(producto)
      }
    };
    this.router.navigate(['/tabs/detalle'], navigationExtras);
  }
  

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    const truncated = text.slice(0, maxLength);
    return truncated.slice(0, truncated.lastIndexOf(' ')) + '...';
  }
}
