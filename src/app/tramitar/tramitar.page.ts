import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { AutenticacionService } from '../services/autenticacion.service';
import { CarritoItem } from '../models/carrito-item';
import { Usuario } from '../models/usuario';
import { NavController } from '@ionic/angular';

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

  tiendas = [
    { nombre: 'Tienda Casco Viejo', direccion: 'Calle del Perro, 1, 48005 Bilbao, Bizkaia', telefono: '944123456', email: 'cascoviejo@juegalmi.com', lat: 43.256960, lng: -2.923441 },
    { nombre: 'Tienda Gran Vía', direccion: 'Gran Vía de Don Diego López de Haro, 25, 48009 Bilbao, Bizkaia', telefono: '944654321', email: 'granvia@juegalmi.com', lat: 43.263012, lng: -2.935112 },
    { nombre: 'Tienda Deusto', direccion: 'Calle Lehendakari Aguirre, 29, 48014 Bilbao, Bizkaia', telefono: '944987654', email: 'deusto@juegalmi.com', lat: 43.271610, lng: -2.946340 },
  ];

  constructor(
    private carritoService: CarritoService,
    private autenticacionService: AutenticacionService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.autenticacionService.obtenerUsuario().subscribe(user => {
      this.usuario = user;
    });
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

  comprarAhora() {
    console.log("Compra realizada");
  }
}
