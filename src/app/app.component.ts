import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { CarritoService } from './services/carrito.service';
import { AutenticacionService } from './services/autenticacion.service';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private carritoService: CarritoService,
    private autenticacionService: AutenticacionService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Llamar a la función de guardar cuando la app se minimiza
      this.platform.pause.subscribe(() => {
        this.guardarCarritoYDeseados();
      });

      // Llamar a la función de guardar al destruir la app
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.guardarCarritoYDeseados();
      });
    });
  }

  ngOnInit() {
    // Puedes cargar carrito y deseados aquí si el usuario ya está autenticado
    this.verificarSesion();
  }

  async verificarSesion() {
    // Verificar si el usuario está logueado y cargar carrito y deseados
    const response = await this.autenticacionService.verificarSesion().toPromise();
    if (response.success) {
      await this.carritoService.cargarCarritoDesdeBD();
      await this.carritoService.cargarDeseadosDesdeBD();
    }
  }

  async guardarCarritoYDeseados() {
    // Verificar si el usuario está logueado antes de guardar
    const isLoggedIn = await this.autenticacionService.verificarSesion().toPromise();
    if (isLoggedIn.success) {
      await this.carritoService.guardarCarritoEnBD();
      await this.carritoService.guardarDeseadosEnBD();
      console.log('Carrito y deseados guardados en pausa o cierre.');
    }
  }
}
