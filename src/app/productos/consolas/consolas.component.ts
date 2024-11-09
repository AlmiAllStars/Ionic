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
  recognition: any;
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
    this.initSpeechRecognition();
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImage; // Imagen de prueba si no se encuentra la original
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
