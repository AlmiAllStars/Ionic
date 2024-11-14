import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { CarritoService } from '../services/carrito.service';
import { NotificacionService } from '../services/notificacion.service';
import { ProductoService } from '../services/producto.service';
import { CarritoItem } from '../models/carrito-item';
import { Producto } from '../models/producto';
import { AutenticacionService } from '../services/autenticacion.service';
import { NavigationExtras, Router } from '@angular/router';
import { Motion } from '@capacitor/motion';

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
  shakeThreshold = 15; // Umbral para detectar agitación
  isDarkMode = false;
  notifications: any[] = [];
  products: Producto[] = [];
  cartItems: CarritoItem[] = [];
  wishlistItems: Producto[] = [];
  total = 0;
  isCartOpen = false;
  isWishlistModalOpen = false;
  user: any;

  isLoginModalOpen = false;
  isLoggedIn = false;
  userName: string = '';
  userEmail: string = '';
  userPicture: string = '';
  email: string = '';
  password: string = '';
  returningtoModal = false;

  baseUrl: string = 'https://retodalmi.duckdns.org';

  // Imagen por defecto para manejar imágenes rotas
  defaultImage: string = '../../assets/images/default-placeholder.png';

  constructor(
    private navController: NavController,
    private carritoService: CarritoService,
    private notificacionService: NotificacionService,
    private productoService: ProductoService,
    private modalController: ModalController,
    private toastController: ToastController,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    // Suscribirse a las notificaciones
    this.notificacionService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
    

    // Suscribirse al carrito
    this.carritoService.cart$.subscribe(cartItems => {
      this.cartItems = cartItems;
      this.calculateTotal();
    });

    this.carritoService.wishlist$.subscribe(wishlistItems => {
      this.wishlistItems = wishlistItems;
    });

    this.autenticacionService.usuarioActual$.subscribe(usuario => {
      if (usuario) {
        this.isLoggedIn = true;
        this.userName = usuario.nombre + " " + usuario.apellido;
        this.userEmail = usuario.email;
        this.userPicture = usuario.picture;
        this.user = usuario;
      } else {
        this.isLoggedIn = false;
      }
    });

    

    // Verificar la sesión y cargar el carrito y deseados si está logueado
    await this.verificarSesion();
    if (this.returningtoModal) this.isLoginModalOpen = true;
    this.returningtoModal = false;

    this.initShakeListener();
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.log('Imagen no encontrada:', imgElement.src);
    imgElement.src = this.defaultImage; // Imagen de prueba si no se encuentra la original
  }  


  async ionViewWillEnter() {
    await this.verificarSesion();
    if(this.returningtoModal) {
      this.isLoginModalOpen = true; // Abre el modal si returningtoModal es true
      this.returningtoModal = false; // Restablece returningtoModal a false
    }
  }

  initShakeListener() {
    Motion.addListener('accel', (event) => {
      if (this.isShake(event.acceleration)) {
        console.log('¡Dispositivo agitado! Mostrando un producto aleatorio...');
        this.mostrarProductoAleatorio();
      }
    });
  }

  async mostrarProductoAleatorio() {
    const randomProduct = this.productoService.getRandomProduct();
  
    const loading = await this.loadingController.create({
      message: 'Cargando producto aleatorio...',
      spinner: 'crescent',
    });
    await loading.present();
    if (!randomProduct) {
      this.showToast('No se encontró ningún producto.');
      await loading.dismiss();
      return;
    }
    try {
      await this.productoService.obtenerProductoPorId(randomProduct.id);
      this.router.navigate(['/tabs/detalle'], {
        queryParams: { animacion: true }
      });
    } catch (error) {
      this.showToast('Error al cargar el producto.');
    } finally {
      await loading.dismiss(); // Ocultar el indicador de carga
    }
  }

  simulateShake() {
    console.log('Simulación de agitación activada.');
  
    // Simular un evento de aceleración alto (agitación)
    const mockAcceleration = {
      acceleration: { x: 16, y: 0, z: 0 }, // Valores que superan el umbral
      timestamp: Date.now()
    };
  
    // Llama a la función `isShake` con los valores simulados
    if (this.isShake(mockAcceleration.acceleration)) {
      console.log('¡Mock de agitación detectado!');
      this.mostrarProductoAleatorio();
    }
  }

  isShake(acceleration: { x: number; y: number; z: number }): boolean {
    const { x, y, z } = acceleration;
    return Math.abs(x) > this.shakeThreshold || Math.abs(y) > this.shakeThreshold || Math.abs(z) > this.shakeThreshold;
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
    this.isWishlistModalOpen = false;
    this.isLoginModalOpen = true;
  }

  closeLoginModal() {
    this.isLoginModalOpen = false; // Cierra el modal de login
    this.email = '';               // Limpia el email y contraseña después de cerrar
    this.password = '';
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      cssClass: 'custom-loading',
      spinner: 'crescent',
    });
    await loading.present();
  
    try {
      const response = await this.autenticacionService.login(this.email, this.password).toPromise();
      if (response.success) {
        this.isLoggedIn = true;
        this.showToast('Inicio de sesión exitoso');
        this.closeLoginModal();
      } else {
        this.showToast(response.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      this.showToast('Ocurrió un error al iniciar sesión');
    } finally {
      await loading.dismiss();
    }
  }
  

  async verificarSesion() {
    const loading = await this.loadingController.create({
      message: 'Verificando sesión de usuario...',
      cssClass: 'custom-loading',
      spinner: 'crescent',
    });
    await loading.present();
  
    this.autenticacionService.verificarSesion().subscribe({
      next: async (response) => {
        this.isLoggedIn = response.success;
        if (this.isLoggedIn) {

        } else {
          this.isDarkMode = false;
        }
        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
        this.showToast('Error al verificar sesión');
      }
    });
  }
  

  async logout() {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      cssClass: 'custom-loading',
      spinner: 'crescent',
    });
    await loading.present();
  
    try {
      // Guardar carrito y deseados en la base de datos antes de cerrar sesión
      await this.guardarCarrito();
      await this.guardarDeseados();
  
      // Cerrar sesión
      this.autenticacionService.logout();
      this.isLoggedIn = false;
      this.showToast('Sesión cerrada');
    } catch (error) {
      this.showToast('Error al cerrar sesión');
    } finally {
      await loading.dismiss();
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

  async guardarDeseados() {
    const wishData = JSON.stringify(this.carritoService.getWishlistItems()); // Obtener los datos de la lista de deseados
  
    try {
      await this.autenticacionService.guardarWishList(wishData);
      console.log('Lista de deseados guardada exitosamente.');
    } catch (error) {
      console.error('Error al guardar la lista de deseados:', error);
    }
  }
  
  async onCameraIconClick() {
    try {
      const response = await this.autenticacionService.captureAndUploadPicture();
      this.verificarSesion();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Upload failed with message:', error.message);
      } else if (typeof error === 'object' && error !== null) {
        console.error('Upload failed with unknown object:', JSON.stringify(error));
        
        if ('response' in error) {
          const response = (error as { response: unknown }).response;
          
          if (typeof response === 'object' && response !== null) {
            if ('status' in response && 'data' in response) {
              const status = (response as { status: number }).status;
              const data = (response as { data: any }).data;
              console.error('HTTP Response Error:', { status, data });
            } else {
              console.error('Response object without status or data:', response);
            }
          } else {
            console.error('Unknown response type:', response);
          }
        }
      } else {
        console.error('Upload failed with unknown error type:', error);
      }
    }
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
    this.isWishlistModalOpen = false;
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

  removeItem(item: CarritoItem) {
    this.carritoService.removeFromCart(item.id);
    this.guardarCarrito();
  }

  clearCart() {
    this.carritoService.clearCart();
    this.guardarCarrito();
  }

  decreaseQuantity(item: CarritoItem) {
    this.carritoService.decreaseQuantity(item.id);
    this.guardarCarrito();
  }

  increaseQuantity(item: CarritoItem) {
    this.carritoService.increaseQuantity(item.id);
    this.guardarCarrito();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.price * item.cantidad), 0);
  }

  async openWishlistModal() {
    await this.exitLoginModal();
    this.isWishlistModalOpen = true;
  }

  closeWishlistModal() {
    this.isWishlistModalOpen = false;
  }

  eliminarDeDeseados(producto: Producto) {
    this.carritoService.removeFromWishlist(producto.id);
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
  
    this.autenticacionService.registrar(this.nombre, this.apellido, this.email, this.password)
      .subscribe(async response => {
        if (response.success) {
          this.isLoggedIn = true;
          this.showToast('Registro y login exitosos');
          this.closeRegisterModal();
        } else {
          this.showToast(response.error || 'Error al registrar');
        }
      }, error => {
        this.showToast('Error en el registro: ' + error);
      });
  }

  async exitLoginModal() {
    this.isLoginModalOpen = false;
    this.returningtoModal = true;
    return new Promise(resolve => setTimeout(resolve, 300)); // Espera un breve periodo para que cierre completamente
  }

  async exitCerrando() {
    this.isLoginModalOpen = false;
    this.returningtoModal = false;
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
    await this.exitCerrando();
    this.navController.navigateForward('/pedidos');
  }

  async navigateToTramitar() {
    await this.exitCarritoModal();
    this.navController.navigateForward('/tramitar');
  }

  // Ahora vamos a hacer una funcion abrirProducto que desde la imagen en el carrito de un producto, lo busca en nuestros 3 arrays y lo abre en la pagina de detalle
  async abrirProducto(item: CarritoItem) {
    const loading = await this.loadingController.create({
      message: 'Cargando producto...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      await this.productoService.obtenerProductoPorId(item.id);
      this.closeCart();
      this.router.navigate(['tabs/detalle']); // Navegar después de cargar el producto
    } catch (error) {
      this.showToast('Error al cargar el producto.');
    } finally {
      await loading.dismiss(); // Ocultar el indicador de carga
    }
  }

}
