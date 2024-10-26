import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  public tabButtons = [
    { title: 'Home', icon: 'cart', path: 'productos' },
    { title: 'Galería', icon: 'images', path: 'galeria' },
    { title: 'Tiendas', icon: 'storefront', path: 'tiendas' },
    { title: 'About-us', icon: 'information-circle', path: 'about-us' }
  ];

  notifications = [
    { text: 'You have a new message!', icon: 'mail-outline' },
    { text: 'Your order has been shipped!', icon: 'cube-outline' },
    { text: 'System update available', icon: 'cloud-download-outline' },
    { text: 'Friend request accepted', icon: 'person-add-outline' },{ text: 'You have a new message!', icon: 'mail-outline' },
    { text: 'Your order has been shipped!', icon: 'cube-outline' },
    { text: 'System update available', icon: 'cloud-download-outline' },
    { text: 'Friend request accepted', icon: 'person-add-outline' },
  ];
  
  isCartOpen = false;
  cartItems = [
    { title: 'Game 1', quantity: 1, price: 3.15, imageUrl: '../../assets/sample-image.jpg' },
    { title: 'Console 2', quantity: 2, price: 2.50, imageUrl: '../../assets/sample-image.jpg' },
    { title: 'Accessory 3', quantity: 1, price: 1.20, imageUrl: '../../assets/sample-image.jpg' }
  ];
  total = 0;

  constructor() {
    this.calculateTotal();
  }

  openCart() {
    this.isCartOpen = true;
    console.log(this.isCartOpen);
  }

  closeCart() {
    this.isCartOpen = false;
  }

  removeItem(item : any) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }
  

}
