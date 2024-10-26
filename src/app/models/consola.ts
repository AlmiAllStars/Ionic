import { Producto } from './producto';

export interface Consola extends Producto {
  modelo: string;
  marca: string;
  misc?: string; // Campo opcional para detalles adicionales
}
