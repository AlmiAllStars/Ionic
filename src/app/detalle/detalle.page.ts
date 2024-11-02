import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Videojuego } from '../models/videojuego';
import { CarritoService } from '../services/carrito.service';
import { Consola } from '../models/consola';
import { Dispositivo } from '../models/dispositivo';

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
  tipoProducto: 'videojuego' | 'consola' | 'dispositivo' | null = null;

  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private router: Router
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
      console.log('Producto:', this.tipoProducto, this.producto, this.consola, this.device);
    });
  }


  formatPrice() {
    const priceParts = this.producto.price.toString().split('.');
    this.wholePrice = priceParts[0];
    this.fractionPrice = priceParts[1];
  }

  anadirAlCarrito() {
    this.carritoService.addToCart(this.producto);
    this.volver();
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
}
