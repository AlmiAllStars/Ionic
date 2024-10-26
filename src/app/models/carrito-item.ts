import { Producto } from './producto';

export interface CarritoItem extends Producto {
  cantidad: number;
}
