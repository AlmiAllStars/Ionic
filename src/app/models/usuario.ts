export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    contraseña: string;
    telefono: number;
    fechaRegistro: Date;
    direccion?: string;
    codigoPostal?: number;
    picture?: string;
  }
  