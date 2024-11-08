import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { CarritoItem } from '../models/carrito-item';
import { NavigationExtras, Route, Router } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { AutenticacionService } from '../services/autenticacion.service';
export interface Sale {
  sale: {
    id: number;
    timestamp: string;
    processed: boolean;
    resolution_timestamp: string | null;
  };
  operations: Operation[];
}

export interface Operation {
  operation_id: number;
  charge: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    picture: string;
  };
}

export interface Pedido {
  id: number;
  fecha: string;
  total: number;
  productos: {
    cantidad: number;
    price: number;
    id: number;
    name: string;
    description: string;
    picture: string;
  }[];
}


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  pedidos: Pedido[] = []; // Cambiar a Pedido[]
  pedidosFiltrados: Pedido[] = [];  
  pedidoSeleccionado: any | null = null; // Pedido que se muestra en el modal
  searchTerm: string = ''; // Término de búsqueda
  isDetalleModalOpen: boolean = false; // Estado del modal de detalle

  constructor(private navController: NavController, private productoService: ProductoService, private router: Router, private toastController: ToastController, private loadingController: LoadingController,private authService: AutenticacionService) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.authService.obtenerPedidos().subscribe({
      next: (response: Sale[]) => {
        console.log('Pedidos:', response);
        this.pedidos = response.map((sale: Sale) => ({
          id: sale.sale.id,
          fecha: sale.sale.timestamp,
          total: sale.operations.reduce((acc, op) => acc + op.charge, 0),
          productos: sale.operations.map(op => ({
            ...op.product,
            cantidad: 1, // Ajustar según lógica
            price: op.charge,
          })),
        }));
        this.pedidosFiltrados = [...this.pedidos];
      },
      error: (error) => {
        console.error('Error al obtener los pedidos:', error);
      },
    });
    
  }

  buscarPedidos(event: any) {
    const valor = this.searchTerm.toLowerCase();
    this.pedidosFiltrados = this.pedidos.filter(pedido =>
      pedido.productos.some(producto =>
        producto.name.toLowerCase().includes(valor)
      )
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
    const loading = await this.loadingController.create({
      message: 'Cargando producto...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      await this.productoService.obtenerProductoPorId(item.id);
      this.cerrarModal();
      await loading.dismiss();
      this.router.navigate(['tabs/detalle']); // Navegar después de cargar el producto
    } catch (error) {
      this.showToast('Error al cargar el producto.');
    } finally {
      await loading.dismiss(); // Ocultar el indicador de carga
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
