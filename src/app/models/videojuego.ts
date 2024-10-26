import { Producto } from './producto';

export interface Videojuego extends Producto {
  fechaLanzamiento: Date;
  pegi: number;
  generos?: string[]; // Array de géneros como strings
}
