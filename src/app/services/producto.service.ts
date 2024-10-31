import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Videojuego } from '../models/videojuego';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://3.229.96.79:8080/juegalmi/ws/videogames';
  private productsSubject = new BehaviorSubject<Videojuego[]>([]);
  public products$: Observable<Videojuego[]> = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Método para cargar videojuegos desde la API
  cargarVideojuegosDesdeAPI(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(this.apiUrl).pipe(
      tap((videojuegos) => {
        // Asegurar que todos los videojuegos tengan un array de géneros
        const videojuegosConGeneros = videojuegos.map(videojuego => ({
          ...videojuego,
          genres: videojuego.genres || [] // Si `generos` está ausente, se asigna un array vacío
        }));
        
        this.productsSubject.next(videojuegosConGeneros);
        console.log('Videojuegos cargados con géneros:', videojuegosConGeneros);
      })
    );
  }
  

  // Método para obtener todos los productos
  obtenerProductos(): Observable<Videojuego[]> {
    return this.products$;
  }

  // Método para obtener un producto específico por su ID
  obtenerProductoPorId(id: number): Observable<Videojuego | undefined> {
    const producto = this.productsSubject.value.find(p => p.id === id);
    return new BehaviorSubject(producto).asObservable();
  }

  // Método para obtener productos filtrados por género
  obtenerProductosPorGenero(genero: string): Observable<Videojuego[]> {
    const productosFiltrados = this.productsSubject.value.filter(p => p.genres?.includes(genero));
    return new BehaviorSubject(productosFiltrados).asObservable();
  }
}
