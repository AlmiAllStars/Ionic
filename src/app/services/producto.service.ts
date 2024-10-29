import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productsSubject = new BehaviorSubject<Producto[]>([
    { id: 1, nombre: 'Game 1', descripcion: 'Un videojuego emocionante', precio: 3.15, imagen: '../../assets/sample-image.jpg' },
    { id: 2, nombre: 'Console 2', descripcion: 'Consola de última generación', precio: 2.50, imagen: '../../assets/sample-image.jpg' },
    { id: 3, nombre: 'Accessory 3', descripcion: 'Accesorio para consola', precio: 1.20, imagen: '../../assets/sample-image.jpg' }
  ]);
  public products$: Observable<Producto[]> = this.productsSubject.asObservable();

  obtenerProductos(): Observable<Producto[]> {
    return this.products$;
  }

  obtenerProductoPorId(id: number): Observable<Producto | undefined> {
    const producto = this.productsSubject.value.find(p => p.id === id);
    return new BehaviorSubject(producto).asObservable();
  }
}
