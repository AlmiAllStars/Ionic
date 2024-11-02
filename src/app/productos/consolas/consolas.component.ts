import { Component, HostListener, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Consola } from '../../models/consola';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-consolas',
  templateUrl: './consolas.component.html',
  styleUrls: ['./consolas.component.scss'],
})
export class ConsolasComponent implements OnInit {
  novedades: Consola[] = [];
  marcas: { nombre: string; items: Consola[] }[] = [];
  resultadosBusqueda: Consola[] = [];
  seccionActual = 'consolas';
  busquedaActiva = false;

  constructor(private productoService: ProductoService, private router: Router) {}

  ngOnInit() {
    // Cargar datos de consolas
    this.productoService.cargarConsolasDesdeAPI().subscribe((consolas) => {
      this.cargarNovedades(consolas);
      this.cargarMarcas(consolas);
    });
  }

  cargarNovedades(consolas: Consola[]) {
    const maxGeneration = Math.max(...consolas.map(c => c.generation));
    this.novedades = consolas
      .filter(consola => consola.generation === maxGeneration)
      .slice(-5); // Últimos 5 elementos de la generación más alta
  }

  cargarMarcas(consolas: Consola[]) {
    const marcasMap = new Map<string, Consola[]>();
    consolas.forEach((consola) => {
      if (consola.brand) {
        if (!marcasMap.has(consola.brand)) {
          marcasMap.set(consola.brand, []);
        }
        marcasMap.get(consola.brand)?.push(consola);
      }
    });
    this.marcas = Array.from(marcasMap, ([nombre, items]) => ({ nombre, items }));
  }

  // Función de búsqueda para filtrar consolas por nombre
  buscar(event: any) {
    const query = event.target.value.toLowerCase();
    this.busquedaActiva = query.trim() !== '';
    if (query && query.trim() !== '') {
      this.productoService.cargarConsolasDesdeAPI().subscribe((consolas) => {
        this.resultadosBusqueda = consolas.filter((consola) =>
          consola.name.toLowerCase().includes(query)
        );
      });
    } else {
      this.resultadosBusqueda = [];
    }
  }

  verDetalles(consola: Consola) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        producto: JSON.stringify(consola)
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
