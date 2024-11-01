import { Producto } from './producto';

export interface Consola extends Producto {
  model: string;       // Modelo de la consola (por ejemplo, PlayStation 5)
  brand: string;       // Marca de la consola (por ejemplo, Sony)
  generation: number;  // Generación de la consola (por ejemplo, 9)
  disk: number;        // Capacidad de almacenamiento en GB
  quantity: number;    // Cantidad en inventario
}
