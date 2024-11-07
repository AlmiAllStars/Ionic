import { Producto } from './producto';

export interface CarritoItem extends Producto {
  cantidad: number;
  tipo: 'videojuego' | 'consola' | 'dispositivo';
  operationType: 'order' | 'rent'; // Especifica si es una compra o un alquiler
}
