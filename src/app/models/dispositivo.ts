import { Producto } from './producto';

export interface Dispositivo extends Producto {
  type: string;        // Tipo de dispositivo (por ejemplo, móvil, tablet)
  model: string;       // Modelo del dispositivo
  brand: string;       // Marca del dispositivo
  processor?: string;  // Procesador del dispositivo
  memory?: number;     // Memoria RAM en GB
  screen?: string;     // Tamaño de pantalla
  camera?: string;     // Características de la cámara
  battery?: number;    // Capacidad de la batería en mAh
  disk?: number;       // Capacidad de almacenamiento en GB
  quantity: number;    // Cantidad disponible en stock
}