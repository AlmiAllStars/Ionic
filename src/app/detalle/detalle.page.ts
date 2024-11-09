import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Videojuego } from '../models/videojuego';
import { CarritoService } from '../services/carrito.service';
import { Consola } from '../models/consola';
import { Dispositivo } from '../models/dispositivo';
import { AutenticacionService } from '../services/autenticacion.service';
import { ToastController } from '@ionic/angular';
import { TabsPage } from '../tabs/tabs.page';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  wholePrice: string = '';
  fractionPrice: string = '';
  baseUrl: string = 'http://54.165.248.142:8080';

  // Imagen por defecto para manejar imágenes rotas
  defaultImage: string = '../../assets/images/default-placeholder.png';

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private autenticacionService: AutenticacionService,
    private toastController: ToastController,
    private tabsPage: TabsPage,
    public productoService: ProductoService
  ) {}

  ngOnInit() {
    const producto = this.productoService.getProductoActual();
    console.log('Producto actual:', this.productoService.productoActual);
  
    if (!producto) {
      this.showToast('No se encontraron detalles del producto.');
      this.router.navigate(['/tabs/home']);
      return;
    }
  
    this.formatPrice();
  }
  
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImage; // Imagen de prueba si no se encuentra la original
  }  



  formatPrice() {
    const priceParts = this.productoService.productoActual.price.toString().split('.');
    this.wholePrice = priceParts[0];
    console.log('Precio:', this.wholePrice);
    this.fractionPrice = priceParts[1] || '00'; // Asegurar que siempre haya dos dígitos
  }
  

  async anadirAlCarrito() {
    // Verifica si el usuario está logueado
    this.autenticacionService.verificarSesion().subscribe(async (response) => {
      if (response.success) {
        // El usuario está logueado, añade el producto al carrito
        this.productoService.agregarProductoAlCarrito('order');
        this.guardarCarrito();
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

  async guardarCarrito() {
    const cartData = JSON.stringify(this.carritoService.getCartItems()); // Obtener los datos del carrito
  
    try {
      await this.autenticacionService.guardarCarrito(cartData);
      console.log('Carrito guardado exitosamente.');
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }
  
  
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  async alquilar() {
    this.autenticacionService.verificarSesion().subscribe(async (response) => {
      if (response.success) {
        // El usuario está logueado, añade el producto al carrito
        this.productoService.agregarProductoAlCarrito('rent');
        this.guardarCarrito();
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
    this.productoService.agregarProductoAWishlist();
    this.showToast('Producto añadido a la lista de deseos');
  }
}
