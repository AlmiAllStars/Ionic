import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoItem } from '../models/carrito-item';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private cartSubject = new BehaviorSubject<CarritoItem[]>([
   
  ]);
  public cart$: Observable<CarritoItem[]> = this.cartSubject.asObservable();

  addToCart(product: Producto, tipo: 'videojuego' | 'consola' | 'dispositivo') {
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.findIndex(item => item.id === product.id);

    if (itemIndex > -1) {
      currentCart[itemIndex].cantidad += 1;
    } else {
      const newItem: CarritoItem = { ...product, cantidad: 1 , tipo};
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
