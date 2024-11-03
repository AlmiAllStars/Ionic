import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoItem } from '../models/carrito-item';
import { Producto } from '../models/producto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://3.229.96.79:8080/juegalmi/ws/';
  private cartSubject = new BehaviorSubject<CarritoItem[]>([]);
  private wishlistSubject = new BehaviorSubject<Producto[]>([]);

  public cart$: Observable<CarritoItem[]> = this.cartSubject.asObservable();
  public wishlist$: Observable<Producto[]> = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) { }

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

  addToWishlist(producto: Producto) {
    const currentWishlist = this.wishlistSubject.value;

    if (!currentWishlist.includes(producto)) {
      currentWishlist.push(producto);
      this.wishlistSubject.next(currentWishlist);
    }
  }

  removeFromCart(productId: number) {
    const updatedCart = this.cartSubject.value.filter(item => item.id !== productId);
    this.cartSubject.next(updatedCart);
  }

  removeFromWishlist(productId: number) {
    const updatedWishlist = this.wishlistSubject.value.filter(producto => producto.id !== productId);
    this.wishlistSubject.next(updatedWishlist);
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

  async guardarCarritoEnBD() {
    const cartData = JSON.stringify(this.cartSubject.value); // Stringify JSON
    try {
      //await this.http.post(`${this.apiUrl}/guardarCarrito`, { cart: cartData }).toPromise();
    } catch (error) {
      console.error('Error al guardar el carrito en la base de datos', error);
    }
  }

  async cargarCarritoDesdeBD() {
    try {
      const response = await this.http.get<{ cart: string }>(`${this.apiUrl}/obtenerCarrito`).toPromise();
      const cartItems: CarritoItem[] = response?.cart ? JSON.parse(response.cart) : [];
      this.cartSubject.next(cartItems);
    } catch (error) {
      console.error('Error al cargar el carrito desde la base de datos', error);
    }
  }

  // Guardar lista de deseados en la base de datos
  async guardarDeseadosEnBD() {
    const wishlistData = JSON.stringify(this.wishlistSubject.value); // Stringify JSON
    try {
      await this.http.post(`${this.apiUrl}/guardarDeseados`, { wishlist: wishlistData }).toPromise();
    } catch (error) {
      console.error('Error al guardar la lista de deseados en la base de datos', error);
    }
  }

  // Cargar lista de deseados desde la base de datos
  async cargarDeseadosDesdeBD() {
    try {
      const response = await this.http.get<{ wishlist: string }>(`${this.apiUrl}/obtenerDeseados`).toPromise();
      const wishlistItems: Producto[] = response?.wishlist ? JSON.parse(response.wishlist) : [];
      this.wishlistSubject.next(wishlistItems);
    } catch (error) {
      console.error('Error al cargar la lista de deseados desde la base de datos', error);
    }
  }
}
