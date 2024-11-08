import { Component, HostListener, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Consola } from '../../models/consola';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

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

  constructor(private productoService: ProductoService, private router: Router, private loadingController: LoadingController, private toastController: ToastController) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando consolas...',
      cssClass: 'custom-loading',
      spinner: 'crescent', // Spinner con estilo moderno
    });
    await loading.present();
  
    this.productoService.cargarConsolasDesdeAPI().subscribe({
      next: async (consolas) => {
        this.cargarNovedades(consolas);
        this.cargarMarcas(consolas);
        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
        this.showToast('Error al cargar las consolas');
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
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

  async verDetalles(consola: Consola) {
    const loading = await this.loadingController.create({
      message: 'Cargando producto...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      await this.productoService.obtenerProductoPorId(consola.id);
      this.router.navigate(['tabs/detalle']); // Navegar después de cargar el producto
    } catch (error) {
      this.showToast('Error al cargar el producto.');
    } finally {
      await loading.dismiss(); // Ocultar el indicador de carga
    }
  }


  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    const truncated = text.slice(0, maxLength);
    return truncated.slice(0, truncated.lastIndexOf(' ')) + '...';
  }
}
