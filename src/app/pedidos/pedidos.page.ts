import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

interface Pedido {
  id: number;
  fecha: Date;
  total: number;
  productos: { nombre: string; imagen: string; cantidad: number; precio: number }[];
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
        { nombre: 'Producto 1', imagen: '../../assets/sample-image.jpg', cantidad: 1, precio: 49.99 },
        { nombre: 'Producto 2', imagen: '../../assets/sample-image.jpg', cantidad: 2, precio: 19.99 },
      ],
    },
    {
      id: 2,
      fecha: new Date(),
      total: 89.99,
      productos: [
        { nombre: 'Producto 3', imagen: '../../assets/sample-image.jpg', cantidad: 1, precio: 89.99 },
      ],
    },
  ];

  searchTerm: string = '';
  pedidosFiltrados: Pedido[] = [];
  isDetalleModalOpen = false;
  pedidoSeleccionado: Pedido | undefined;

  constructor(private navController: NavController) {}

  ngOnInit() {
    this.pedidosFiltrados = this.pedidos;
  }

  buscarPedidos(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.pedidosFiltrados = this.pedidos.filter(pedido =>
      pedido.productos.some(producto => producto.nombre.toLowerCase().includes(searchTerm))
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
}
