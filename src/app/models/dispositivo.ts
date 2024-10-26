import { Producto } from './producto';

export interface Dispositivo extends Producto {
  tipo: string;
  modelo: string;
  marca: string;
  procesador?: string;
  memoriaRam?: number;
  pantalla?: string;
  camara?: string;
  bateria?: number;
  almacenamiento?: number;
}
