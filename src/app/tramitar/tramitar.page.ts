import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { AutenticacionService } from '../services/autenticacion.service';
import { CarritoItem } from '../models/carrito-item';
import { Usuario } from '../models/usuario';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-tramitar',
  templateUrl: './tramitar.page.html',
  styleUrls: ['./tramitar.page.scss'],
})
export class TramitarPage implements OnInit {
  cartItems: CarritoItem[] = [];
  usuario: Usuario = {} as Usuario;
  shippingOption: string = 'userAddress';
  selectedStore: string = ''; // Tienda seleccionada
  shippingCost: number = 10;
  totalSinIVA: number = 0;
  totalConEnvio: number = 0;
  estimatedArrival: string = '';
  metodoPago: string = '';
  nuevaDireccion: string = '';
  showErrors = false;

  tiendas = [
    { nombre: 'Tienda Casco Viejo', direccion: 'Calle del Perro, 1, 48005 Bilbao, Bizkaia', telefono: '944123456', email: 'cascoviejo@juegalmi.com', lat: 43.256960, lng: -2.923441 },
    { nombre: 'Tienda Gran Vía', direccion: 'Gran Vía de Don Diego López de Haro, 25, 48009 Bilbao, Bizkaia', telefono: '944654321', email: 'granvia@juegalmi.com', lat: 43.263012, lng: -2.935112 },
    { nombre: 'Tienda Deusto', direccion: 'Calle Lehendakari Aguirre, 29, 48014 Bilbao, Bizkaia', telefono: '944987654', email: 'deusto@juegalmi.com', lat: 43.271610, lng: -2.946340 },
  ];

  constructor(
    private carritoService: CarritoService,
    private autenticacionService: AutenticacionService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private productoService: ProductoService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.autenticacionService.obtenerUsuario().subscribe(user => {
      this.usuario = user;
    });
    if (!this.usuario.nombre || !this.usuario.telefono || !this.usuario.apellido) {
      // Mostrar alerta
      const alert = await this.alertController.create({
        header: 'Información incompleta',
        message: 'Necesitas un nombre, apellido y teléfono para realizar una compra. Por favor, complete su perfil.',
        buttons: [
          {
            text: 'Ir a Perfil',
            handler: () => {
              this.navCtrl.navigateForward('/cuenta');
            }
          }
        ]
      });
      await alert.present();
    }
    this.carritoService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
    this.calculateEstimatedArrival();
  }

  calculateTotal() {
    this.totalSinIVA = this.cartItems.reduce((acc, item) => acc + item.price * item.cantidad, 0);
    this.totalConEnvio = this.totalSinIVA + (this.shippingOption === 'storePickup' ? 0 : this.shippingCost);
  }

  calculateEstimatedArrival() {
    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + 2);
    this.estimatedArrival = arrivalDate.toLocaleDateString();
  }

  cancelar() {
    this.navCtrl.back();
  }

  async abrirProducto(item: CarritoItem) {
    // Muestra un indicador de carga
    const loading = await this.loadingController.create({
      message: 'Cargando producto...'
    });
    await loading.present();
    // Esperamos a cargar el producto para cerrar el loading
    const producto = await this.productoService.abrirProducto(item);
    await loading.dismiss();

    if (producto) {
      // Cierra el modal antes de navegar
      
      const navigationExtras: NavigationExtras = {
        queryParams: {
          producto: JSON.stringify(producto)
        }
      };
      
      // Navegar a la página de detalle con los detalles del producto
      this.router.navigate(['/tabs/detalle'], navigationExtras);
    } else {
      // Mostrar un mensaje de error
      const toast = await this.toastController.create({
        message: 'No se ha podido cargar el producto',
        duration: 2000
      });
      toast.present();
    }
  }

  comprarAhora() {
    this.showErrors = false;

    const nombreCompleto = !!this.usuario.nombre;
    const telefonoCompleto = !!this.usuario.telefono;
    const emailCompleto = !!this.usuario.email;
    const direccionCompleta = this.direccionValida();
    const metodoPagoCompleto = !!this.metodoPago;

    // Comprobamos si todos los campos son válidos
    if (nombreCompleto && telefonoCompleto && emailCompleto && direccionCompleta && metodoPagoCompleto) {
      // Todos los campos están completos, procedemos con la compra 
      this.procesarPedido();
    } else {
      // Mostrar los errores y detener el proceso de compra
      this.showErrors = true;
      console.log("Por favor completa todos los campos obligatorios");
    }
  }

  // Método de validación de dirección
  direccionValida(): boolean {
    if (this.shippingOption === 'userAddress' && this.usuario.direccion) {
      return true;
    } else if (this.shippingOption === 'newAddress' && this.nuevaDireccion) {
      return true;
    } else if (this.shippingOption === 'storePickup') {
      return true;
    }
    return false;
  }

  async procesarPedido() {
    console.log(this.carritoService.getCartItems());
    try {
      await this.carritoService.procesarCarrito();
      console.log('Compra finalizada con éxito.');
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
    }
  }

}
