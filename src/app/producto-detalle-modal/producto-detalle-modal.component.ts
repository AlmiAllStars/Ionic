import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Videojuego } from '../models/videojuego';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-producto-detalle-modal',
  templateUrl: './producto-detalle-modal.component.html',
  styleUrls: ['./producto-detalle-modal.component.scss'],
})
export class ProductoDetalleModalComponent {
  @Input() producto!: Videojuego;

  constructor(private modalController: ModalController,private carritoService: CarritoService) {}

  cerrarModal() {
    this.modalController.dismiss();
  }

  anadirAlCarrito() {
    this.carritoService.addToCart(this.producto); // Añade al carrito usando el servicio
    this.cerrarModal();
  }

  alquilar() {
    // Lógica para alquilar el producto
    console.log('Producto alquilado:', this.producto);
    this.cerrarModal();
  }
}
