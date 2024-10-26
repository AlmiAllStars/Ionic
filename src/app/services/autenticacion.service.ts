import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private usuarioPrueba = {
    id: 1,
    nombre: 'Usuario Prueba',
    email: 'usuario@prueba.com',
    contraseña: '1234'
  };

  login(email: string, password: string): Observable<any> {
    // Simulación de autenticación de usuario
    if (email === this.usuarioPrueba.email && password === this.usuarioPrueba.contraseña) {
      return of({ success: true, usuario: this.usuarioPrueba });
    } else {
      return of({ success: false, error: 'Credenciales incorrectas' });
    }
  }

  logout() {
    // Aquí puedes simular el cierre de sesión si es necesario
  }

  verificarSesion(): Observable<any> {
    // Simulación de verificación de sesión
    return of({ success: false });
  }
}
