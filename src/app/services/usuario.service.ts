import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioPrueba: Usuario = {
    id: 1,
    nombre: 'John',
    apellido: 'Doe',
    email: 'johndoe@example.com',
    contraseña: '1234',
    telefono: 123456789,
    fechaRegistro: new Date(),
    direccion: '123 Calle Falsa',
    codigoPostal: '48000'
  };

  obtenerUsuario(id: number): Observable<Usuario> {
    return of(this.usuarioPrueba); // Devuelve el usuario de prueba
  }

  actualizarUsuario(id: number, usuarioData: Partial<Usuario>): Observable<Usuario> {
    // Simulación de actualización de datos del usuario
    this.usuarioPrueba = { ...this.usuarioPrueba, ...usuarioData };
    return of(this.usuarioPrueba);
  }
}
