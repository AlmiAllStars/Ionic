import { Component, HostListener, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { Videojuego } from '../models/videojuego';
import { ModalController } from '@ionic/angular';
import { ProductoDetalleModalComponent } from '../producto-detalle-modal/producto-detalle-modal.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  recomendados: Videojuego[] = [];
  generos: { nombre: string; items: Videojuego[] }[] = [];
  resultadosBusqueda: Videojuego[] = []; // Propiedad para almacenar resultados de búsqueda
  underlineTransform = 'translateX(0)'; // Transformación inicial de la barra azul
  isScrolled = false; // Estado para controlar si el menú está oculto
  lastScrollTop = 0; // Para registrar la última posición de scroll

  constructor(private productoService: ProductoService, private modalController: ModalController) {}

  ngOnInit() {
    this.productoService.cargarVideojuegosDesdeAPI().subscribe((videojuegos) => {
      this.cargarRecomendados(videojuegos);
      this.cargarGeneros(videojuegos);
    });
  }

  cargarRecomendados(videojuegos: Videojuego[]) {
    this.recomendados = videojuegos.slice(videojuegos.length - 6);
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
  
    const truncated = text.slice(0, maxLength);
    return truncated.slice(0, truncated.lastIndexOf(' ')) + '...';
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
      console.log('Resultados de búsqueda:', this.resultadosBusqueda);
    } else {
      this.resultadosBusqueda = []; // Restablece los resultados si no hay consulta de búsqueda
    }
  }

  cargarPagina(event: any) {
    const value = event.detail.value;
    const index = this.getSegmentIndex(value);
    this.underlineTransform = `translateX(${index * 25}%)`; // Ajusta el porcentaje según el ancho de los botones
    // Lógica para cargar la página correspondiente
  }

  getSegmentIndex(value: string): number {
    switch (value) {
      case 'videojuegos':
        return 0;
      case 'consolas':
        return 1;
      case 'devices':
        return 2;
      case 'reparaciones':
        return 3;
      default:
        return 0;
    }
  }

  // Detecta el scroll y oculta/muestra el menú según la dirección
  @HostListener('window:scroll', [])
  onWindowScroll() {
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollTop > this.lastScrollTop) {
      // Scrolling down
      this.isScrolled = true;
    } else {
      // Scrolling up
      this.isScrolled = false;
    }
    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
  }

  
  async verDetalles(producto: Videojuego) {
    const modal = await this.modalController.create({
      component: ProductoDetalleModalComponent,
      componentProps: { producto },
      cssClass: 'small-modal' // Aplica una clase personalizada
    });
    console.log('clase del modal que vamos a abrir', modal);
    return await modal.present();
  }
  
}
