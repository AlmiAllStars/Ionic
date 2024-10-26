import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { CarritoService } from '../services/carrito.service';
import { NotificacionService } from '../services/notificacion.service';
import { ProductoService } from '../services/producto.service';
import { CarritoItem } from '../models/carrito-item';
import { Producto } from '../models/producto';
import { AutenticacionService } from '../services/autenticacion.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  public tabButtons = [
    { title: 'Home', icon: 'cart', path: 'productos' },
    { title: 'Galería', icon: 'images', path: 'galeria' },
    { title: 'Tiendas', icon: 'storefront', path: 'tiendas' },
    { title: 'About-us', icon: 'information-circle', path: 'about-us' }
  ];

  notifications: any[] = [];
  products: Producto[] = [];
  cartItems: CarritoItem[] = [];
  total = 0;
  isCartOpen = false;

  isLoginModalOpen = false;
  isLoggedIn = false;
  userName: string = '';

  email: string = '';
  password: string = '';

  constructor(
    private navController: NavController,
    private carritoService: CarritoService,
    private notificacionService: NotificacionService,
    private productoService: ProductoService,
    private modalController: ModalController,
    private toastController: ToastController,
    private autenticacionService: AutenticacionService
  ) {}

  ngOnInit() {
    // Suscribirse a los productos
    this.productoService.products$.subscribe(products => {
      this.products = products;
    });

    // Suscribirse a las notificaciones
    this.notificacionService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });

    // Suscribirse al carrito
    this.carritoService.cart$.subscribe(cartItems => {
      this.cartItems = cartItems;
      this.calculateTotal();
    });

    this.verificarSesion();
  }

  openLoginModal() {
    this.isLoginModalOpen = true;
    console.log('Abriendo modal de login');
  }

  closeLoginModal() {
    this.isLoginModalOpen = false; // Cierra el modal de login
    this.email = '';               // Limpia el email y contraseña después de cerrar
    this.password = '';
  }

  async login() {
    try {
      const response = await this.autenticacionService.login(this.email, this.password).toPromise();
      if (response.success) {
        this.isLoggedIn = true;              // Marca como logueado
        this.userName = response.usuario.nombre; // Guarda el nombre del usuario
        this.showToast('Inicio de sesión exitoso');
        this.closeLoginModal();
      } else {
        this.showToast(response.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      this.showToast('Ocurrió un error al iniciar sesión');
    }
  }

  verificarSesion() {
    this.autenticacionService.verificarSesion().subscribe(response => {
      this.isLoggedIn = response.success;
      if (this.isLoggedIn) {
        this.userName = response.usuario.nombre; // Guarda el nombre del usuario si está logueado
      }
    });
  }

  logout() {
    this.autenticacionService.logout(); // Llama al método de logout en el servicio
    this.isLoggedIn = false;            // Marca como no logueado
    this.userName = '';                 // Limpia el nombre del usuario
    this.showToast('Sesión cerrada');
  }

  recuperarContrasena() {
    this.showToast('Funcionalidad de recuperación aún no implementada');
  }

  irARegistro() {
    this.closeLoginModal();
    // Navegar a la página de registro (cambiar la ruta según sea necesario)
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  navigateToHome() {
    this.navController.navigateRoot('/tabs/productos');
  }

  openCart() {
    this.isCartOpen = true;
  }

  closeCart() {
    const modalElement = document.querySelector('.cart-modal');

    if (modalElement) {
      modalElement.classList.add('hidden');
      setTimeout(() => {
        this.isCartOpen = false;
        modalElement.classList.remove('hidden');
      }, 300);
    }
  }

  addToCart(product: Producto) {
    this.carritoService.addToCart(product);
  }

  removeItem(item: CarritoItem) {
    this.carritoService.removeFromCart(item.id);
  }

  clearCart() {
    this.carritoService.clearCart();
  }

  decreaseQuantity(item: CarritoItem) {
    this.carritoService.decreaseQuantity(item.id);
  }

  increaseQuantity(item: CarritoItem) {
    this.carritoService.increaseQuantity(item.id);
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  async showInfo() {
    const toast = await this.toastController.create({
      message: 'El precio de algunas reparaciones pueden variar.',
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}
