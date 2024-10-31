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

  isDarkMode = false;
  notifications: any[] = [];
  products: Producto[] = [];
  cartItems: CarritoItem[] = [];
  total = 0;
  isCartOpen = false;

  isLoginModalOpen = false;
  isLoggedIn = false;
  userName: string = '';
  userEmail: string = '';
  userPicture: string = '';
  email: string = '';
  password: string = '';
  returningtoModal = false;

  constructor(
    private navController: NavController,
    private carritoService: CarritoService,
    private notificacionService: NotificacionService,
    private productoService: ProductoService,
    private modalController: ModalController,
    private toastController: ToastController,
    private autenticacionService: AutenticacionService
  ) { }

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
    if (this.returningtoModal) this.isLoginModalOpen = true;
    this.returningtoModal = false;
  }

  ionViewWillEnter() {
    this.verificarSesion();
    if (this.returningtoModal) {
      this.isLoginModalOpen = true; // Abre el modal si returningtoModal es true
      this.returningtoModal = false; // Restablece returningtoModal a false
    }
  }

  initializeDarkPalette(isDark: any) {
    this.isDarkMode = isDark;
    this.toggleDarkPalette(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(ev: any) {
    this.toggleDarkPalette(ev.detail.checked);
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: any) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  openLoginModal() {
    this.isLoginModalOpen = true;
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
        this.userName = response.usuario.nombre + " " + response.usuario.apellido;
        this.userEmail = response.usuario.email;
        this.userPicture = response.usuario.imagen;
        this.showToast('Inicio de sesión exitoso');
        this.closeLoginModal();
      } else {
        this.showToast(response.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      this.showToast('Ocurrió un error al iniciar sesión');
    }
  }

  verificarSesion() {
    this.autenticacionService.verificarSesion().subscribe(response => {
      this.isLoggedIn = response.success;
      if (this.isLoggedIn) {
        this.userName = response.usuario.nombre + " " + response.usuario.apellido;
        this.userEmail = response.usuario.email;
        this.userPicture = response.usuario.imagen;
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
      }
      else {
        this.isDarkMode = false;
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
    this.total = this.cartItems.reduce((acc, item) => acc + (item.price * item.cantidad), 0);
  }

  async showInfo() {
    const toast = await this.toastController.create({
      message: 'El precio de algunas reparaciones pueden variar.',
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }

  isRegisterModalOpen = false;
  nombre: string = '';
  apellido: string = '';
  repassword: string = '';

  openRegisterModal() {
    this.closeLoginModal();
    this.isRegisterModalOpen = true;
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
    this.nombre = '';
    this.apellido = '';
    this.email = '';
    this.password = '';
    this.repassword = '';
  }
  async loginWithGoogle() {
    const response = await this.autenticacionService.loginWithGoogle();
    if (response.success) {
      this.isLoggedIn = true;
      this.userName = response.usuario!.givenName;
      this.userEmail = response.usuario!.email;
      this.userPicture = response.usuario!.imageUrl;
      this.showToast('Inicio de sesión con Google exitoso');
      this.closeLoginModal();
    } else {
      this.showToast(response.error!);
    }
  }


  async registrar() {
    if (!this.nombre || !this.apellido || !this.email || !this.password || !this.repassword) {
      this.showToast('Por favor, completa todos los campos.');
      return;
    }

    if (this.password !== this.repassword) {
      this.showToast('Las contraseñas no coinciden.');
      return;
    }

    this.autenticacionService.registrar(this.nombre, this.apellido, this.email, this.password).subscribe(response => {
      if (response.success) {
        this.isLoggedIn = true;
        this.userName = response.usuario.nombre + " " + response.usuario.apellido;
        this.userEmail = response.usuario.email;
        this.userPicture = response.usuario.imagen;
        this.showToast('Registro exitoso');
        this.closeRegisterModal();
      } else {
        this.showToast('Error al registrar');
      }
    });
  }
  async exitLoginModal() {
    this.isLoginModalOpen = false;
    this.returningtoModal = true;
    return new Promise(resolve => setTimeout(resolve, 300)); // Espera un breve periodo para que cierre completamente
  }

  async exitCarritoModal() {
    this.isCartOpen = false;
    return new Promise(resolve => setTimeout(resolve, 300)); // Espera un breve periodo para que cierre completamente
  }


  async navigateToCuenta() {
    await this.exitLoginModal();
    this.navController.navigateForward('/cuenta');
  }

  async navigateToPedidos() {
    await this.exitLoginModal();
    this.navController.navigateForward('/pedidos');
  }

  async navigateToTramitar() {
    await this.exitCarritoModal();
    this.navController.navigateForward('/tramitar');
  }
}
