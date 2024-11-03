import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Videojuego } from '../models/videojuego';
import { CarritoService } from '../services/carrito.service';
import { Consola } from '../models/consola';
import { Dispositivo } from '../models/dispositivo';
import { AutenticacionService } from '../services/autenticacion.service';
import { ToastController } from '@ionic/angular';
import { TabsPage } from '../tabs/tabs.page';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  producto!: Videojuego;
  device!: Dispositivo;
  consola!: Consola;
  wholePrice: string = '';
  fractionPrice: string = '';
  tipoProducto: 'videojuego' | 'consola' | 'dispositivo' = "videojuego";

  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private router: Router,
    private autenticacionService: AutenticacionService,
    private toastController: ToastController,
    private tabsPage: TabsPage
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['producto']) {
        if (params['producto'].includes('generation')) {
          this.producto = JSON.parse(params['producto']);
          this.consola = JSON.parse(params['producto']);
          this.tipoProducto = 'consola';
        } else if (params['producto'].includes('genres')) {
          this.tipoProducto = 'videojuego';
          this.producto = JSON.parse(params['producto']);
        } else {
          this.producto = JSON.parse(params['producto']);
          this.tipoProducto = 'dispositivo';
          this.device = JSON.parse(params['producto']);
        }
      }
      this.formatPrice();
    });
  }


  formatPrice() {
    const priceParts = this.producto.price.toString().split('.');
    this.wholePrice = priceParts[0];
    this.fractionPrice = priceParts[1];
  }

  async anadirAlCarrito() {
    // Verifica si el usuario está logueado
    this.autenticacionService.verificarSesion().subscribe(async (response) => {
      if (response.success) {
        // El usuario está logueado, añade el producto al carrito
        this.carritoService.addToCart(this.producto, this.tipoProducto);
        this.showToast('Producto añadido al carrito');
        this.volver();
      } else {
        // El usuario no está logueado, muestra un Toast y abre el modal de login
        this.showToast('Entra con tu cuenta para empezar a comprar');
  
        // Abre el modal de login
        this.tabsPage.openLoginModal();
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

  alquilar() {
    console.log('Producto alquilado:', this.producto);
  }

  reparar() {
    this.router.navigate(['/tabs/productos/reparaciones']); // Navegar a la página de reparaciones
  }

  volver() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Navegar a `defaultHref` si no hay historial previo
      this.router.navigate(['/tabs/productos/']);
    }
  }

  addWish() {
    this.carritoService.addToWishlist(this.producto);
    this.showToast('Producto añadido a la lista de deseos');
  }
}
