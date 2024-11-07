import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Videojuego } from '../models/videojuego';
import { Consola } from '../models/consola';
import { Dispositivo } from '../models/dispositivo';
import { tap, catchError, map } from 'rxjs/operators';
import { CarritoItem } from '../models/carrito-item';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://3.229.96.79:8080/juegalmi/ws/';
  private usarDatosLocales = false; // Cambiar a `false` para usar la API real
  private productoDetalles: any = null;

  // Subjects y Observables para cada tipo de producto
  private videojuegosSubject = new BehaviorSubject<Videojuego[]>([]);
  public videojuegos$: Observable<Videojuego[]> = this.videojuegosSubject.asObservable();

  private consolasSubject = new BehaviorSubject<Consola[]>([]);
  public consolas$: Observable<Consola[]> = this.consolasSubject.asObservable();

  private dispositivosSubject = new BehaviorSubject<Dispositivo[]>([]);
  public dispositivos$: Observable<Dispositivo[]> = this.dispositivosSubject.asObservable();

  constructor(private http: HttpClient) {}

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

  // Funcion que recibe un item de carrito y lo busca en los arrays de productos y devuelve el (videojuego, consola o dispositivo) que corresponda
  async abrirProducto(item: CarritoItem): Promise<Videojuego | Consola | Dispositivo | undefined> {
    if (item.tipo === 'videojuego' && this.videojuegosSubject.value.length === 0) {
      // Cargar videojuegos si no están cargados
      await this.cargarVideojuegosDesdeAPI().toPromise();

    } else if (item.tipo === 'consola' && this.consolasSubject.value.length === 0) {
      // Cargar consolas si no están cargadas
      await this.cargarConsolasDesdeAPI().toPromise();
      console.log('Consolas cargadas', this.consolasSubject.value);
    } else if (item.tipo === 'dispositivo' && this.dispositivosSubject.value.length === 0) {
      // Cargar dispositivos si no están cargados
      await this.cargarDispositivosDesdeAPI().toPromise();
    }
  
    // Ahora que los datos deberían estar cargados, buscar el producto específico
    if (item.tipo === 'videojuego') {
      return this.videojuegosSubject.value.find(v => v.id === item.id);
    } else if (item.tipo === 'consola') {
      return this.consolasSubject.value.find(c => c.id === item.id);
    } else if (item.tipo === 'dispositivo') {
      return this.dispositivosSubject.value.find(d => d.id === item.id);
    } else {
      return undefined;
    }
  }
  
  
  setProductoDetalles(producto: any) {
    this.productoDetalles = null;
    this.productoDetalles = producto;
    sessionStorage.removeItem('productoDetalles');
    sessionStorage.setItem('productoDetalles', JSON.stringify(producto));
  }
  
  getProductoDetalles(): any {
    if (!this.productoDetalles) {
      const data = sessionStorage.getItem('productoDetalles');
      this.productoDetalles = data ? JSON.parse(data) : null;
    }
    return this.productoDetalles;
  }
  
  
}

