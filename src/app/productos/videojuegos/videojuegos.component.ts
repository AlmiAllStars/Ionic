import { Component, HostListener, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Videojuego } from '../../models/videojuego';
import { Consola } from '../../models/consola';
import { Dispositivo } from '../../models/dispositivo';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

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
  busquedaActiva = false;

  isScrolled = false;
  lastScrollTop = 0;

  constructor(private productoService: ProductoService, private router: Router, private loadingController: LoadingController, private toastController: ToastController) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando consolas...',
      cssClass: 'custom-loading',
      spinner: 'crescent', // Spinner con estilo moderno
    });
    await loading.present();
  
    this.productoService.cargarVideojuegosDesdeAPI().subscribe({
      next: async (games) => {
        this.cargarRecomendados(games);
        this.cargarGeneros(games);
        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
        this.showToast('Error al cargar los videojuegos');
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
    this.busquedaActiva = query.trim() !== '';
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
    this.productoService.setProductoDetalles(producto);
    this.router.navigate(['/tabs/detalle']);
  }
  

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    const truncated = text.slice(0, maxLength);
    return truncated.slice(0, truncated.lastIndexOf(' ')) + '...';
  }
}
