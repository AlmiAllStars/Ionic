import { Component, HostListener, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Dispositivo } from '../../models/dispositivo';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

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

  constructor(private productoService: ProductoService, private router: Router, private loadingController: LoadingController, private toastController: ToastController) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando consolas...',
      cssClass: 'custom-loading',
      spinner: 'crescent', // Spinner con estilo moderno
    });
    await loading.present();
  
    this.productoService.cargarDispositivosDesdeAPI().subscribe({
      next: async (devices) => {
        this.cargarNovedades(devices);
        this.cargarTipos(devices);
        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
        this.showToast('Error al cargar los dispositivos');
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

  async verDetalles(dispositivo: Dispositivo) {
    const loading = await this.loadingController.create({
      message: 'Cargando producto...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      await this.productoService.obtenerProductoPorId(dispositivo.id);
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
