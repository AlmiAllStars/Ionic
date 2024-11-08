import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoItem } from '../models/carrito-item';
import { Producto } from '../models/producto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://54.165.248.142:8080/juegalmi/ws/';
  private cartSubject = new BehaviorSubject<CarritoItem[]>([]);
  private wishlistSubject = new BehaviorSubject<Producto[]>([]);

  public cart$: Observable<CarritoItem[]> = this.cartSubject.asObservable();
  public wishlist$: Observable<Producto[]> = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) { }

  addToCart(product: Producto, tipo: 'videojuego' | 'consola' | 'dispositivo', tipoOperacion: 'order' | 'rent') {
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.findIndex(item => item.id === product.id);

    if (itemIndex > -1) {
      currentCart[itemIndex].cantidad += 1;
    } else {
      const newItem: CarritoItem = { ...product, cantidad: 1 , tipo, operationType: tipoOperacion};
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

  getCartItems(): CarritoItem[] {
    return this.cartSubject.value;
  }
  
  

  cargarCarritoDesdeJson(cartJson: string): void {
    try {
      const cartItems: CarritoItem[] = cartJson ? JSON.parse(cartJson) : [];
      this.cartSubject.next(cartItems);
      console.log('Carrito cargado desde JSON.');
    } catch (error) {
      console.error('Error al cargar el carrito desde JSON', error);
    }
  }

  cargarWishlistDesdeJson(wishlistJson: string): void {
    try {
      const wishlistItems: Producto[] = wishlistJson ? JSON.parse(wishlistJson) : [];
      this.wishlistSubject.next(wishlistItems);
      console.log('Lista de deseados cargada desde JSON.');
    } catch (error) {
      console.error('Error al cargar la lista de deseados desde JSON', error);
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

  getWishlistItems(): Producto[] {
    return this.wishlistSubject.value;
  }
  
  async procesarCarrito(): Promise<void> {
    const cartItems = this.getCartItems(); // Obtener los elementos del carrito
    console.log('Elementos del carrito:', cartItems);
    const operationsData = cartItems.map(item => ({
      id_product: item.id,
      type: item.operationType, // Usamos el nuevo campo operationType
      quantity: item.operationType === 'order' ? item.cantidad: undefined, // Cantidad como cantidad si es order
      rental_time: item.operationType === 'rent' ? 5 : undefined, // Cantidad como tiempo de alquiler si es rent
      price: item.operationType === 'rent' ? 15 : item.price // Precio específico si es un alquiler
    }));
  
    try {
      const token = localStorage.getItem('token'); // Token para autenticación
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      const requestBody = {
        worker_id: 1, // Reemplazar con el ID del worker real que corresponda
        operations: operationsData
      };
  
      const response = await this.http
        .post(`${this.apiUrl}secure/operations`, requestBody, { headers })
        .toPromise();
  
      console.log('Operaciones procesadas correctamente:', response);
  
      // Limpiar el carrito después del procesamiento
      this.clearCart();
    } catch (error) {
      console.error('Error al procesar operaciones:', error);
    }
  }
  
  
  
}
