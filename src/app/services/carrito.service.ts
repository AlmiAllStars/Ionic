import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoItem } from '../models/carrito-item';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cartSubject = new BehaviorSubject<CarritoItem[]>([
    { id: 1, nombre: 'Game 1', descripcion: 'Un videojuego emocionante', precio: 3.15, cantidad: 1, imagen: '../../assets/sample-image.jpg' },
    { id: 2, nombre: 'Console 2', descripcion: 'Consola de última generación', precio: 2.50, cantidad: 2, imagen: '../../assets/sample-image.jpg' },
    { id: 3, nombre: 'Accessory 3', descripcion: 'Accesorio para consola', precio: 1.20, cantidad: 1, imagen: '../../assets/sample-image.jpg' }
  ]);
  public cart$: Observable<CarritoItem[]> = this.cartSubject.asObservable();

  addToCart(product: Producto) {
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.findIndex(item => item.id === product.id);

    if (itemIndex > -1) {
      currentCart[itemIndex].cantidad += 1;
    } else {
      const newItem: CarritoItem = { ...product, cantidad: 1 };
      currentCart.push(newItem);
    }

    this.cartSubject.next([...currentCart]);
  }

  removeFromCart(productId: number) {
    const updatedCart = this.cartSubject.value.filter(item => item.id !== productId);
    this.cartSubject.next(updatedCart);
  }

  clearCart() {
    this.cartSubject.next([]);
  }

  decreaseQuantity(productId: number) {
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.findIndex(item => item.id === productId);

    if (itemIndex > -1 && currentCart[itemIndex].cantidad > 1) {
      currentCart[itemIndex].cantidad -= 1;
    } else {
      this.removeFromCart(productId);
    }

    this.cartSubject.next([...currentCart]);
  }

  increaseQuantity(productId: number) {
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
      currentCart[itemIndex].cantidad += 1;
      this.cartSubject.next([...currentCart]);
    }
  }
}
