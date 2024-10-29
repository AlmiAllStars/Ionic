import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  constructor() {}

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

  private idNuevo = 2;

  login(email: string, password: string): Observable<any> {
    if (email === this.usuarioPrueba.email && password === this.usuarioPrueba.contraseña) {
      localStorage.setItem('usuario', JSON.stringify(this.usuarioPrueba)); 
      return of({ success: true, usuario: this.usuarioPrueba });  
    } else {
      return of({ success: false, error: 'Credenciales incorrectas' });
    }
  }

  async loginWithGoogle() {
    try {
      GoogleAuth.initialize({
        clientId: '834457080492-soiprh56fbaca7v3hibr57fmj8mh5iq9.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      console.log('GoogleAuth inicializado');
      const googleUser = await GoogleAuth.signIn();
      // Aquí gestionas los datos del usuario devueltos por Google
      console.log('Usuario de Google:', googleUser);
      return { success: true, usuario: googleUser };
    } catch (error) {
      console.error('Error de Google Login:', error);
      return { success: false, error: 'Error en el inicio de sesión con Google' };
    }
  }

  logout() {
    localStorage.removeItem('usuario'); // Elimina el usuario de LocalStorage
  }

  verificarSesion(): Observable<any> {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      return of({ success: true, usuario: this.usuarioPrueba }); // Si hay usuario en LocalStorage
    } else {
      return of({ success: false }); // Si no hay usuario en LocalStorage
    }
  }

  registrar(nombre: string, apellido: string, email: string, password: string): Observable<any> {
    const nuevoUsuario: Usuario = {
      id: this.idNuevo,
      nombre: nombre,
      apellido: apellido,
      email: email,
      contraseña: password,
      telefono: 0,
      fechaRegistro: new Date(),
      direccion: '',
      codigoPostal: ''
    };
    this.usuarioPrueba = nuevoUsuario;
    this.idNuevo++;
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario)); // Guardar en LocalStorage
    return of({ success: true, usuario: this.usuarioPrueba });
  }

  obtenerUsuario(): Observable<Usuario> {
    return of(this.usuarioPrueba); // Devuelve el usuario de prueba
  }

  actualizarUsuario(id: number, usuarioData: Partial<Usuario>): Observable<Usuario> {
    // Simulación de actualización de datos del usuario
    this.usuarioPrueba = { ...this.usuarioPrueba, ...usuarioData };
    return of(this.usuarioPrueba);
  }

  setUsuario(usuario: Usuario) {
    this.usuarioPrueba = usuario;
  }

  vaciarUsuario() {
    this.usuarioPrueba = {
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      contraseña: '',
      telefono: 0,
      fechaRegistro: new Date(),
      direccion: '',
      codigoPostal: ''
    };
  }
}
