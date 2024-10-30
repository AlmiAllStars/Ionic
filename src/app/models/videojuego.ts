import { Producto } from './producto';

export interface Videojuego extends Producto {
  release_date: string; // Cambiado de `fechaLanzamiento` a `release_date`, y tipo string para formato de fecha
  pegi: number;
  genres: string[]; // Cambiado de `generos` a `genres`
  quantity?: number; // Añadido campo opcional `quantity` si es relevante
}
