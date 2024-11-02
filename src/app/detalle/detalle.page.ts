import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Videojuego } from '../models/videojuego';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  producto!: Videojuego;
  wholePrice: string = '';
  fractionPrice: string = '';

  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['producto']) {
        this.producto = JSON.parse(params['producto']);
      }
      console.log('Producto:', this.producto);
      this.formatPrice();
    });
  }

  formatPrice() {
    const priceParts = this.producto.price.toString().split('.');
    this.wholePrice = priceParts[0];
    this.fractionPrice = priceParts[1];
  }

  anadirAlCarrito() {
    this.carritoService.addToCart(this.producto);
    window.history.back();
  }

  alquilar() {
    console.log('Producto alquilado:', this.producto);
  }
}
