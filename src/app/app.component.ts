import { Component, ViewChild } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { CarritoService } from './services/carrito.service';
import { AutenticacionService } from './services/autenticacion.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet!: IonRouterOutlet;
  constructor(
    private platform: Platform,
    private carritoService: CarritoService,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private location: Location
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
      this.platform.backButton.subscribeWithPriority(10, () => {
        if (this.routerOutlet && this.routerOutlet.canGoBack()) {
          this.routerOutlet.pop();
        } else if (this.location.path() === '/home') {
          (navigator as any).app.exitApp(); // Forzar salida si estás en la página principal
        } else {
          this.location.back(); // Retroceder usando Location
        }
      });
    });

  }

  ngOnInit() {
    // Puedes cargar carrito y deseados aquí si el usuario ya está autenticado
  }

  


  async guardarCarritoYDeseados() {
    // Verificar si el usuario está logueado antes de guardar
    const isLoggedIn = await this.autenticacionService.verificarSesion().toPromise();
    if (isLoggedIn.success) {
      await this.guardarCarrito();
      await this.carritoService.guardarDeseadosEnBD();
      console.log('Carrito y deseados guardados en pausa o cierre.');
    }
  }

  async guardarCarrito() {
    const cartData = JSON.stringify(this.carritoService.getCartItems()); // Obtener los datos del carrito
  
    try {
      await this.autenticacionService.guardarCarrito(cartData);
      console.log('Carrito guardado exitosamente.');
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }
}
