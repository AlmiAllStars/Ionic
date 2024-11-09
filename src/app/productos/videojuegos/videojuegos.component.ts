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
  recognition: any;
  lastScrollTop = 0;
  baseUrl: string = 'http://54.165.248.142:8080';

  // Imagen por defecto para manejar imágenes rotas
  defaultImage: string = '../../assets/images/default-placeholder.png';

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
    this.initSpeechRecognition();
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImage; // Imagen de prueba si no se encuentra la original
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

  initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'es-ES'; // Configura el idioma para español
      this.recognition.continuous = false; // Solo escucha una frase a la vez
      this.recognition.interimResults = false; // Resultados finales, no parciales
  
      this.recognition.onresult = (event: any) => {
        const voiceQuery = event.results[0][0].transcript;
        console.log('Texto detectado:', voiceQuery);
        this.buscarPorVoz(voiceQuery); // Llamar a la función de búsqueda con el texto
      };
  
      this.recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        this.showToast('Error en el reconocimiento de voz. Inténtalo de nuevo.');
      };
    } else {
      console.error('El navegador no soporta SpeechRecognition');
      this.showToast('El reconocimiento de voz no es compatible con tu navegador.');
    }
  }

  iniciarBusquedaPorVoz() {
    if (this.recognition) {
      this.recognition.start();
    } else {
      this.showToast('No se puede iniciar la búsqueda por voz.');
    }
  }
  
  buscarPorVoz(voiceQuery: string) {
    // Obtener el input de búsqueda (ion-searchbar)
    const searchbar = document.querySelector('ion-searchbar');
    if (searchbar) {
      searchbar.value = voiceQuery; // Escribir la consulta en el input
      // Crear un evento manual para simular que el usuario escribió
      const event = new CustomEvent('ionInput', { detail: { value: voiceQuery } });
      searchbar.dispatchEvent(event);
    }
  
    // Ahora, llama directamente a la función `buscar`
    this.buscar({ target: { value: voiceQuery } });
  }

  // Detectar el scroll y ocultar/mostrar el menú según la dirección
  @HostListener('window:scroll', [])
  onWindowScroll() {
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.isScrolled = currentScrollTop > this.lastScrollTop;
    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }

  async verDetalles(producto: Videojuego) {
    const loading = await this.loadingController.create({
      message: 'Cargando producto...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      await this.productoService.obtenerProductoPorId(producto.id);
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
