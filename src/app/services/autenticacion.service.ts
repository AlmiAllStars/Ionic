import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private usuarioPrueba: Usuario = {
    id: 1,
    nombre: 'John',
    apellido: 'Doe',
    email: 'almi@gmail.com',
    contraseña: 'Almi123',
    telefono: 123456789,
    fechaRegistro: new Date(),
    direccion: '123 Calle Falsa',
    codigoPostal: '48000'
  };

  login(email: string, password: string): Observable<any> {
    if (email === this.usuarioPrueba.email && password === this.usuarioPrueba.contraseña) {
      localStorage.setItem('usuario', JSON.stringify(this.usuarioPrueba)); // Guardar en LocalStorage
      return of({ success: true, usuario: this.usuarioPrueba });
    } else {
      return of({ success: false, error: 'Credenciales incorrectas' });
    }
  }

  logout() {
    localStorage.removeItem('usuario'); // Elimina el usuario de LocalStorage
  }

  verificarSesion(): Observable<any> {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      return of({ success: true, usuario: JSON.parse(usuario) }); // Si hay usuario en LocalStorage
    } else {
      return of({ success: false }); // Si no hay usuario en LocalStorage
    }
  }
}
