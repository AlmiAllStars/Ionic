import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Videojuego } from '../models/videojuego';
import { Consola } from '../models/consola';
import { Dispositivo } from '../models/dispositivo';
import { tap, catchError, map } from 'rxjs/operators';
import { CarritoItem } from '../models/carrito-item';
import { CarritoService } from './carrito.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'https://retodalmi.duckdns.org/juegalmi/ws/';
  private usarDatosLocales = false; // Cambiar a `false` para usar la API real
  private productoId: number | null = null;
  productoActual: any = null;

  // Subjects y Observables para cada tipo de producto
  private videojuegosSubject = new BehaviorSubject<Videojuego[]>([]);
  public videojuegos$: Observable<Videojuego[]> = this.videojuegosSubject.asObservable();

  private consolasSubject = new BehaviorSubject<Consola[]>([]);
  public consolas$: Observable<Consola[]> = this.consolasSubject.asObservable();

  private dispositivosSubject = new BehaviorSubject<Dispositivo[]>([]);
  public dispositivos$: Observable<Dispositivo[]> = this.dispositivosSubject.asObservable();

  constructor(private http: HttpClient, private carritoService: CarritoService) {}

  private cargarDatosLocales(): Observable<any> {
    return this.http.get('assets/data/data.json').pipe(
      catchError(error => {
        console.error('Error al cargar los datos locales', error);
        return of({});
      })
    );
  }

  cargarVideojuegosDesdeAPI(): Observable<Videojuego[]> {
    if (this.usarDatosLocales) {
      return this.cargarDatosLocales().pipe(
        map(data => data.videojuegos || []),
        tap(videojuegos => this.videojuegosSubject.next(videojuegos))
      );
    } else {
      return this.http.get<Videojuego[]>(this.apiUrl + 'videogames').pipe(
        tap((videojuegos) => {
          const videojuegosConGeneros = videojuegos.map(videojuego => ({
            ...videojuego,
            genres: videojuego.genres || []
          }));
          this.videojuegosSubject.next(videojuegosConGeneros);
        })
      );
    }
  }

  cargarConsolasDesdeAPI(): Observable<Consola[]> {
    if (this.usarDatosLocales) {
      return this.cargarDatosLocales().pipe(
        map(data => data.consolas || []),
        tap(consolas => this.consolasSubject.next(consolas))
      );
    } else {
      return this.http.get<Consola[]>(this.apiUrl + 'consoles').pipe(
        tap(consolas => this.consolasSubject.next(consolas))
      );
    }
  }

  cargarDispositivosDesdeAPI(): Observable<Dispositivo[]> {
    if (this.usarDatosLocales) {
      return this.cargarDatosLocales().pipe(
        map(data => data.devices || []),
        tap(dispositivos => this.dispositivosSubject.next(dispositivos))
      );
    } else {
      return this.http.get<Dispositivo[]>(this.apiUrl + 'devices').pipe(
        tap(dispositivos => this.dispositivosSubject.next(dispositivos))
      );
    }
  }

  // Métodos de obtención
  obtenerVideojuegos(): Observable<Videojuego[]> {
    return this.videojuegos$;
  }

  obtenerConsolaPorId(id: number): Observable<Consola | undefined> {
    const consola = this.consolasSubject.value.find(c => c.id === id);
    return new BehaviorSubject(consola).asObservable();
  }

  obtenerDispositivoPorId(id: number): Observable<Dispositivo | undefined> {
    const dispositivo = this.dispositivosSubject.value.find(d => d.id === id);
    return new BehaviorSubject(dispositivo).asObservable();
  }

  setProductoActual(producto: any): void {
    this.productoActual = producto;
  }

  getProductoActual(): any {
    return this.productoActual;
  }

  obtenerProductoPorId(id: number): Promise<any> {
    const url = this.apiUrl + `product/${id}`;
    return this.http.get<any>(url).pipe(
      tap((producto) => {
        this.productoActual = producto; // Guardar automáticamente el producto actual
        console.log('Producto actual:', this.productoActual);
        this.tipoProducto = producto.productType;
      })
    ).toPromise(); // Convierte a Promise para usar con async/await
  }

  tipoProducto: 'videojuego' | 'consola' | 'dispositivo' | null = null;

  agregarProductoAlCarrito(tipoOperacion: 'order' | 'rent') {
    if (this.productoActual && this.tipoProducto) {
      this.carritoService.addToCart(this.productoActual, this.tipoProducto, tipoOperacion);
    } else {
      console.error('Producto actual o tipo de producto no definidos.');
    }
  }

  agregarProductoAWishlist() {
    if (this.productoActual) {
      this.carritoService.addToWishlist(this.productoActual);
    } else {
      console.error('Producto actual no definido.');
    }
  }

  getRandomProduct(): { id: number; name: string } | null {
    const videojuegos = this.videojuegosSubject.value;
    const consolas = this.consolasSubject.value;
    const dispositivos = this.dispositivosSubject.value;

    const allProducts = [
      ...videojuegos.map(v => ({ id: v.id, name: v.name })),
      ...consolas.map(c => ({ id: c.id, name: c.name })),
      ...dispositivos.map(d => ({ id: d.id, name: d.name }))
    ];

    if (allProducts.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * allProducts.length);
    return allProducts[randomIndex];
  }

}

