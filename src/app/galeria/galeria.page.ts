import { Component } from '@angular/core';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage {
  isImageModalOpen = false;
  selectedImageIndex: number = 0;
  currentFilter = 'Todos';
  selectedImage: any;
  images = [
    { url: '../../assets/gallery/Evento1.jpg', title: 'Evento 1', type: 'Evento' },
    { url: '../../assets/gallery/Tienda1.jpg', title: 'Tienda 1', type: 'Tienda' },
    { url: '../../assets/gallery/Evento2.webp', title: 'Evento 2', type: 'Evento' },
    { url: '../../assets/gallery/Gente1.jpg', title: 'Flipaos', type: 'Evento' },
    { url: '../../assets/gallery/Tienda2.jpg', title: 'Tienda 2', type: 'Tienda' },
    { url: '../../assets/gallery/Evento1.jpg', title: 'Evento 1', type: 'Evento' },
    { url: '../../assets/gallery/Gente1.jpg', title: 'Flipaos', type: 'Evento' },
    { url: '../../assets/gallery/Tienda1.jpg', title: 'Tienda 1', type: 'Tienda' },
    { url: '../../assets/gallery/Evento2.webp', title: 'Evento 2', type: 'Evento' },
    { url: '../../assets/gallery/Tienda2.jpg', title: 'Tienda 2', type: 'Tienda' }
  ];
  filteredImages = this.images;
  

  openImageModal(image: any) {
    this.selectedImage = image;
    this.isImageModalOpen = true;
  }

  openFilterOptions() {
    // Implementa la lógica de filtrado aquí, o abre un modal para seleccionar filtros
    this.filteredImages = this.images.filter(img => img.type === this.currentFilter || this.currentFilter === 'Todos');
  }

  closeImageModal() {
    this.isImageModalOpen = false;
  }

  likeImage() {
    // Implementa la funcionalidad de "Like"
  }

  async shareImage() {
    try {
      await Share.share({
        title: 'Comparte esta imagen',
        text: 'Echa un vistazo a esta imagen!',
        url: this.selectedImage,
        dialogTitle: 'Compartir con...'
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  }

  prevImage() {
    if (this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    } else {
      this.selectedImageIndex = this.filteredImages.length - 1;  // Regresa al final si está en la primera
    }
    this.selectedImage = this.filteredImages[this.selectedImageIndex];
  }

  nextImage() {
    if (this.selectedImageIndex < this.filteredImages.length - 1) {
      this.selectedImageIndex++;
    } else {
      this.selectedImageIndex = 0;
    }
    this.selectedImage = this.filteredImages[this.selectedImageIndex];
  }

  closeImageModal2(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Verificar si el clic fue en el contenedor del lightbox
    if (target.classList.contains('lightbox-container')) {
      this.closeImageModal();
    }
  }

  //Eventos de desplazaminto

startX: number = 0; 
endX: number = 0;   
translateX: number = 0;
swipeThreshold = 100;


startSwipe(event: TouchEvent) {
  this.startX = event.touches[0].clientX;
  this.translateX = 0;
}

moveSwipe(event: TouchEvent) {
  this.endX = event.touches[0].clientX;
  this.translateX = this.endX - this.startX;

  const maxTranslateX = window.innerWidth * 0.5;
  if (this.translateX > maxTranslateX) this.translateX = maxTranslateX;
  if (this.translateX < -maxTranslateX) this.translateX = -maxTranslateX;
}




endSwipe() {
  

  if (this.startX - this.endX > this.swipeThreshold) {
    this.nextImage();
  }

  else if (this.endX - this.startX > this.swipeThreshold) {
    this.prevImage();
  }

  this.translateX = 0;

  this.startX = 0;
  this.endX = 0;
}

}
