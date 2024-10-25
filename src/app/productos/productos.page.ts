import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage {
  tabs = 1;

  // creamos una variable en donde ponemos el ion-content
  

  videoGames = [
    { title: 'Video Game 1', imageUrl: 'assets/sample-image.jpg' },
    { title: 'Video Game 2', imageUrl: 'assets/sample-image.jpg' },
    { title: 'Consoles', imageUrl: 'assets/sample-image.jpg' }
  ];

    @ViewChild('contentContainer') contentContainer!: ElementRef;
  
    products: any[] = [];
    rentals: any[] = [];
    repairs: any[] = [];
    imageUrl: string = 'assets/sample-image.jpg';  // Imagen de prueba para todos los elementos
  
    constructor() {}
  
    ngOnInit() {
      this.loadProducts();
      this.loadRentals();
      this.loadRepairs();
    }
  
    loadProducts() {
      this.products = [
        { title: 'Producto 1', price: 300 },
        { title: 'Producto 2', price: 400 },
        { title: 'Producto 3', price: 350 },
      ];
    }
  
    loadRentals() {
      this.rentals = [
        { title: 'Alquiler 1', price: 500 },
        { title: 'Alquiler 2', price: 600 },
        { title: 'Alquiler 3', price: 450 },
      ];
    }
  
    loadRepairs() {
      this.repairs = [
        { title: 'Reparación 1', price: 200 },
        { title: 'Reparación 2', price: 300 },
        { title: 'Reparación 3', price: 250 },
      ];
    }
  
    // Función para desplazarse a una sección específica
    scrollToSection(sectionId: string) {
      const element = document.getElementById(sectionId);

      if (element) {
        if (sectionId == "productos") {
          this.tabs = 1;
        } else if (sectionId == "alquileres") {
          this.tabs = 2;
        } else if (sectionId == "reparaciones") {
          this.tabs = 3;
        }
        // desplazamos a la seccion  y ademas al top de la pagina
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      }
    }

    onScroll(event: any) {
      const contentContainer = event.target;
      const scrollLeft = contentContainer.scrollLeft;
      const sectionWidth = contentContainer.offsetWidth;
    
      const activeIndex = Math.round(scrollLeft / sectionWidth);
      this.updateTabColor(activeIndex);
    }

    updateTabColor(index: number) {
      this.tabs = index + 1; 
    }
  }
  