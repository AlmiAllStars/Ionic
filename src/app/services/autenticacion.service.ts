import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, map, Observable, of, retry, switchMap } from 'rxjs';
import { Usuario } from '../models/usuario';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CarritoService } from './carrito.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';


@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  constructor(private http: HttpClient, private carritoService: CarritoService) {}
  private apiUrl = 'https://retodalmi.duckdns.org/juegalmi/ws/';
  private usuarioActualSubject = new BehaviorSubject<any | null>(null);
  usuarioActual$ = this.usuarioActualSubject.asObservable();

  private usuarioActual: Usuario = {
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    contraseña: '',
    telefono: -1,
    fechaRegistro: new Date(),
    direccion: '',
    codigoPostal: -1,
    picture: ''
  };

  private idNuevo = 2;

  login(email: string, password: string): Observable<any> {
    const url = 'https://retodalmi.duckdns.org/api/login'; // Endpoint de login
    const body = { email, password };
  
    return this.http.post<any>(url, body).pipe(
      switchMap(response => {
        if (response && response.token) {
          // Guardar el token en localStorage
          localStorage.setItem('token', response.token);
  
          // Decodificar el token para obtener el email del usuario
          const usuarioData = this.decodeJWT(response.token);
          console.log('Datos decodificados del token:', usuarioData);
  
          // Usar el email para obtener los datos completos del usuario
          return this.getUserDataByEmail(usuarioData.username).pipe(
            map(usuarioCompleto => {
              this.usuarioActual = {
                id: usuarioCompleto.id,
                nombre: usuarioCompleto.name,
                apellido: usuarioCompleto.surname,
                email: usuarioData.username,
                contraseña: '', // No almacenar la contraseña
                telefono: usuarioCompleto.phone || 0,
                fechaRegistro: new Date(usuarioCompleto.registration_date),
                direccion: usuarioCompleto.address || '',
                codigoPostal: usuarioCompleto.postal_code || -1,
                picture: usuarioCompleto.picture || '',

              };

              this.carritoService.cargarCarritoDesdeJson(usuarioCompleto.chart);
              this.carritoService.cargarWishlistDesdeJson(usuarioCompleto.wishlist);
              this.usuarioActualSubject.next(this.usuarioActual);
  
              return { success: true, usuario: this.usuarioActual };
            })
          );
        } else {
          return of({ success: false, error: 'Error en la autenticación' });
        }
      }),
      catchError(error => of({ success: false, error: 'Error en el servidor' }))
    );
  }


  private getUserDataByEmail(email: string): Observable<any> {
    const url = this.apiUrl + `secure/clientbyEmail`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(url, { email }, { headers });
  }
  
  // Función para decodificar el token JWT si contiene información del usuario
  private decodeJWT(token: string): any {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
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
    // Elimina todos los datos relacionados con la sesión
    localStorage.removeItem('token');  // Elimina el token JWT
    this.usuarioActual = {
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      contraseña: '',
      telefono: -1,
      fechaRegistro: new Date(),
      direccion: '',
      codigoPostal: -1,
      picture: '',
    }; 
    
    
    this.carritoService.vaciar();// Limpia el usuario actual en memoria

    this.usuarioActualSubject.next(this.usuarioActual);
  
    // Si tienes otros datos relacionados con el usuario o la sesión, asegúrate de eliminarlos también
    localStorage.clear();  // Limpia todo el localStorage (opcional, si no tienes otros datos persistentes)
  
  }
  

  verificarSesion(): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (token) {
      // Decodificar el token para obtener el email del usuario
      const usuarioData = this.decodeJWT(token);
      console.log('Verificación de sesión, email decodificado:', usuarioData.username);
  
      // Usar el email para obtener los datos completos del usuario
      return this.getUserDataByEmail(usuarioData.username).pipe(
        map(usuarioCompleto => {
          this.usuarioActual = {
            id: usuarioCompleto.id,
            nombre: usuarioCompleto.name,
            apellido: usuarioCompleto.surname,
            email: usuarioData.username,
            contraseña: '', // No almacenar la contraseña
            telefono: usuarioCompleto.phone || 0,
            fechaRegistro: new Date(usuarioCompleto.registration_date),
            direccion: usuarioCompleto.address || '',
            codigoPostal: usuarioCompleto.postal_code || -1,
            picture: usuarioCompleto.picture || ''
          };
          this.carritoService.cargarCarritoDesdeJson(usuarioCompleto.chart);
          this.carritoService.cargarWishlistDesdeJson(usuarioCompleto.wishlist);
          this.usuarioActualSubject.next(this.usuarioActual);

          return { success: true, usuario: this.usuarioActual };
        }),
        catchError(error => {
          console.error('Error al verificar la sesión:', error);
          return of({ success: false, error: 'Error al obtener datos del usuario' });
        })
      );
    } else {
      return of({ success: false, error: 'No hay token disponible' });
    }
  }

  registrar(nombre: string, apellido: string, email: string, password: string): Observable<any> {
    const nuevoCliente = {
      name: nombre,
      surname: apellido,
      email: email,
      password: password,
    };
  
    return this.http.post<any>(this.apiUrl + 'register', nuevoCliente).pipe(
      switchMap(response => {
        if (response && response.message === "Client registered successfully") {
          // Realiza el login automáticamente
          return of(null).pipe(
            delay(500), // Retraso de 1 segundo
            switchMap(() => this.login(email, password)),
            retry(2), // Reintenta el login hasta 2 veces en caso de error
            map(loginResponse => ({ success: true, loginResponse }))
          );
        } else {
          return of({ success: false, error: 'Error al registrar' });
        }
      }),
      catchError(error => of({ success: false, error: error.error?.error || 'Error en el servidor' }))
    );
  }
  

  obtenerReparacionesActivas(): Observable<any[]> {
    const url = this.apiUrl + `secure/client/activeRepairs`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.get<any[]>(url, { headers });
  }

  obtenerUsuario(): Observable<Usuario> {
    return of(this.usuarioActual); // Devuelve el usuario de prueba
  }

  actualizarUsuario(id: number, userData: Partial<any>): Observable<any> {
    const token = localStorage.getItem('token'); // Obtén el token almacenado
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      ...userData, // Los datos a actualizar
    };

    return this.http.put<any>('https://retodalmi.duckdns.org/juegalmi/ws/secure/editClient', body, { headers });
  }

  actualizarUsuarioLocal(fieldToEdit: string, editValue: any): void {

    if (fieldToEdit && this.usuarioActual) {
      (this.usuarioActual as any)[fieldToEdit] = editValue;
    }

    this.usuarioActualSubject.next(this.usuarioActual);
  }
  

  setUsuario(usuario: Usuario) {
    this.usuarioActual = usuario;
  }

  vaciarUsuario() {
    this.usuarioActual = {
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      contraseña: '',
      telefono: -1,
      fechaRegistro: new Date(),
      direccion: '',
      codigoPostal: -1
    };
  }

  getId(): number {
    return this.usuarioActual.id;
  }

  async guardarCarrito(cartData: string): Promise<void> {
    try {
      const usuarioActualId = this.getId();
  
      if (!usuarioActualId) {
        throw new Error('No hay usuario autenticado.');
      }
  
      // Obtener la ubicación actual
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
  
      const locationData = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      };
  
      try {
        await this.actualizarUsuario(usuarioActualId, {
          chart: cartData,
          ...locationData,
        }).toPromise();
      
        // Solo se ejecuta si actualizarUsuario no lanza error
        this.actualizarUsuarioLocal('cart', cartData);
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
      }
    } catch (error) {
      console.error('Error al guardar el carrito y la ubicación en la base de datos', error);
      throw error;
    }
  }

  async guardarWishList(wishData: string): Promise<void> {
    try {
      const usuarioActualId = this.getId();

      if (!usuarioActualId) {
        throw new Error('No hay usuario autenticado.');
      }

      await this.actualizarUsuario(usuarioActualId, { wishlist: wishData }).toPromise();

      // Actualizar localmente el carrito
      this.actualizarUsuarioLocal('cart', wishData);
    } catch (error) {
      console.error('Error al guardar el carrito en la base de datos', error);
      throw error;
    }
  }

  obtenerPedidos(): Observable<any> {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    return this.http.get<any>(`${this.apiUrl}secure/sales`, { headers });
  }

  crearReparacion(data: { description: string }): Observable<any> {
    const url = this.apiUrl + `secure/repair`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.post<any>(url, data, { headers });
  }

  async captureAndUploadPicture() {
    try {
      // Abrir la cámara del dispositivo
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl, // Obtiene la imagen en formato base64
        source: CameraSource.Camera, // Abre directamente la cámara
        quality: 90,
      });
  
      if (!photo || !photo.dataUrl) {
        throw new Error('No photo captured');
      }
  
      // Crear un FormData para enviar la imagen al servidor
      const formData = new FormData();
      const blob = this.dataUrlToBlob(photo.dataUrl);
      formData.append('picture', blob, 'client-picture.jpg');
  
      // Obtener headers con el token
      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  
      // Subir la imagen al servidor
      return this.http
        .post('https://retodalmi.duckdns.org/juegalmi/ws/secure/uploadClientPicture', formData, {
          headers: headers, // Incluir el token en los headers
        })
        .toPromise();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else if (typeof error === 'object' && error !== null) {
        console.error('Unknown object error:', JSON.stringify(error));
        if ('response' in error) {
          console.error('HTTP Response Error:', error.response);
        }
      } else {
        console.error('Unknown error type:', error);
      }
      throw error;
    }
  }
  

  private dataUrlToBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}
