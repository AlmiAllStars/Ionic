import { Component, HostListener, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Dispositivo } from '../../models/dispositivo';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
})
export class DevicesComponent implements OnInit {
  novedades: Dispositivo[] = [];
  tipos: { nombre: string; items: Dispositivo[] }[] = [];
  resultadosBusqueda: Dispositivo[] = [];
  seccionActual = 'dispositivos';
  busquedaActiva = false;

  constructor(private productoService: ProductoService, private router: Router) {}

  ngOnInit() {
    // Cargar datos de dispositivos
    this.productoService.cargarDispositivosDesdeAPI().subscribe((dispositivos) => {
      this.cargarNovedades(dispositivos);
      this.cargarTipos(dispositivos);
    });
  }

  cargarNovedades(dispositivos: Dispositivo[]) {
    this.novedades = dispositivos.slice(-5); // Últimos 5 dispositivos
  }

  cargarTipos(dispositivos: Dispositivo[]) {
    const tiposMap = new Map<string, Dispositivo[]>();
    dispositivos.forEach((dispositivo) => {
      if (dispositivo.type) {
        if (!tiposMap.has(dispositivo.type)) {
          tiposMap.set(dispositivo.type, []);
        }
        tiposMap.get(dispositivo.type)?.push(dispositivo);
      }
    });
    this.tipos = Array.from(tiposMap, ([nombre, items]) => ({ nombre, items }));
  }

  // Función de búsqueda para filtrar dispositivos por nombre
  buscar(event: any) {
    const query = event.target.value.toLowerCase();

    this.busquedaActiva = query.trim() !== '';
    if (query && query.trim() !== '') {
      this.productoService.cargarDispositivosDesdeAPI().subscribe((dispositivos) => {
        this.resultadosBusqueda = dispositivos.filter((dispositivo) =>
          dispositivo.name.toLowerCase().includes(query)
        );
      });
    } else {
      this.resultadosBusqueda = [];
    }
  }

  verDetalles(dispositivo: Dispositivo) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        producto: JSON.stringify(dispositivo)
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
