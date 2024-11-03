import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { CarritoItem } from '../models/carrito-item';
import { NavigationExtras, Route, Router } from '@angular/router';
import { ProductoService } from '../services/producto.service';

interface Pedido {
  id: number;
  fecha: Date;
  total: number;
  productos: { 
    id: number,
    name: string, // Cambiado de `nombre` a `name`
    description: string, // Cambiado de `descripcion` a `description`
    price: number, // Cambiado de `precio` a `price`
    picture: string, // Cambiado de `imagen` a `picture`
    cantidad: number,
    tipo: 'videojuego' | 'consola' | 'dispositivo'
  }[];
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  pedidos: Pedido[] = [
    {
      id: 1,
      fecha: new Date(),
      total: 49.99,
      productos: [
        {id:10, name: 'Starfield',description: '', picture: '../../assets/gallery/public/juego08.jpg', cantidad: 1, price: 49.99 ,tipo: 'videojuego'},
        {id:14, name: 'Xbox One S', description : '', picture: '../../assets/gallery/public/consola08.jpg', cantidad: 2, price: 19.99 ,tipo: 'consola'},
      ],
    },
    {
      id: 2,
      fecha: new Date(),
      total: 89.99,
      productos: [
        {id: 110, name: 'Galaxy S21', description: '' , picture: '../../assets/gallery/public/device08.jpg', cantidad: 1, price: 89.99 , tipo: 'dispositivo'},
      ],
    },
  ];

  searchTerm: string = '';
  pedidosFiltrados: Pedido[] = [];
  isDetalleModalOpen = false;
  pedidoSeleccionado: Pedido | undefined;

  constructor(private navController: NavController, private productoService: ProductoService, private router: Router, private toastController: ToastController, private loadingController: LoadingController) {}

  ngOnInit() {
    this.pedidosFiltrados = this.pedidos;
  }

  buscarPedidos(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.pedidosFiltrados = this.pedidos.filter(pedido =>
      pedido.productos.some(producto => producto.name.toLowerCase().includes(searchTerm))
    );
  }

  abrirDetallePedido(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
    this.isDetalleModalOpen = true;
  }

  closeDetalleModal() {
    this.isDetalleModalOpen = false;
  }

  closePage() {
    this.navController.back();
  }

  async cerrarModal() {
    this.isDetalleModalOpen = false;
    return new Promise(resolve => setTimeout(resolve, 300));
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
      await this.cerrarModal();
      
      const navigationExtras: NavigationExtras = {
        queryParams: {
          producto: JSON.stringify(producto)
        }
      };
      
      // Navegar a la página de detalle con los detalles del producto
      this.router.navigate(['/tabs/detalle'], navigationExtras);
    } else {
      this.showToast('Producto no encontrado');
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
}
