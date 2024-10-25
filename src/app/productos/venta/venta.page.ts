import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.page.html',
  styleUrls: ['./venta.page.scss'],
})
export class VentaPage implements OnInit {
  
  videoGames: any[] = [];
  products: any[] = [];
  imageUrl: string = 'assets/sample-image.jpg';  // Ponemos la misma imagen para todas las pruebas

  constructor() {}

  ngOnInit() {
    this.loadVideoGames();
    this.loadProducts();
  }

  loadVideoGames() {
    // Simulamos la obtención de datos desde el servicio
    this.videoGames = [
      {
        title: 'Video Game 1',
        price: 49.99,
        imageUrl: 'assets/sample-image.jpg'
      },
      {
        title: 'Video Game 2',
        price: 59.99,
        imageUrl: 'assets/sample-image.jpg'
      },
      {
        title: 'Video Game 3',
        price: 39.99,
        imageUrl: 'assets/sample-image.jpg'
      }
    ];
  }

  loadProducts() {
    // Simulamos la obtención de productos
    this.products = [
      { title: 'Producto 1', price: 300 },
      { title: 'Producto 2', price: 400 },
      { title: 'Producto 3', price: 350 },
    ];
  }
}
