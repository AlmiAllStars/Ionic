import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Videojuego } from '../models/videojuego';
import { Consola } from '../models/consola';
import { Dispositivo } from '../models/dispositivo';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://3.229.96.79:8080/juegalmi/ws/';

  // Subjects y Observables para cada tipo de producto
  private videojuegosSubject = new BehaviorSubject<Videojuego[]>([]);
  public videojuegos$: Observable<Videojuego[]> = this.videojuegosSubject.asObservable();

  private consolasSubject = new BehaviorSubject<Consola[]>([]);
  public consolas$: Observable<Consola[]> = this.consolasSubject.asObservable();

  private dispositivosSubject = new BehaviorSubject<Dispositivo[]>([]);
  public dispositivos$: Observable<Dispositivo[]> = this.dispositivosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Método para cargar videojuegos desde la API
  cargarVideojuegosDesdeAPI(): Observable<Videojuego[]> {
    return this.http.get<Videojuego[]>(this.apiUrl + 'videogames').pipe(
      tap((videojuegos) => {
        const videojuegosConGeneros = videojuegos.map(videojuego => ({
          ...videojuego,
          genres: videojuego.genres || [] // Si `genres` está ausente, se asigna un array vacío
        }));
        
        this.videojuegosSubject.next(videojuegosConGeneros);
        console.log('Videojuegos cargados con géneros:', videojuegosConGeneros);
      })
    );
  }

  // Método para cargar consolas desde la API
  cargarConsolasDesdeAPI(): Observable<Consola[]> {
    return this.http.get<Consola[]>(this.apiUrl + 'consoles').pipe(
      tap((consolas) => {
        this.consolasSubject.next(consolas);
        console.log('Consolas cargadas:', consolas);
      })
    );
  }

  // Método para cargar dispositivos desde la API
  cargarDispositivosDesdeAPI(): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(this.apiUrl + 'devices').pipe(
      tap((dispositivos) => {
        this.dispositivosSubject.next(dispositivos);
        console.log('Dispositivos cargados:', dispositivos);
      })
    );
  }

  // Método para obtener todos los videojuegos
  obtenerVideojuegos(): Observable<Videojuego[]> {
    return this.videojuegos$;
  }

  // Método para obtener una consola específica por su ID
  obtenerConsolaPorId(id: number): Observable<Consola | undefined> {
    const consola = this.consolasSubject.value.find(c => c.id === id);
    return new BehaviorSubject(consola).asObservable();
  }

  // Método para obtener un dispositivo específico por su ID
  obtenerDispositivoPorId(id: number): Observable<Dispositivo | undefined> {
    const dispositivo = this.dispositivosSubject.value.find(d => d.id === id);
    return new BehaviorSubject(dispositivo).asObservable();
  }
}