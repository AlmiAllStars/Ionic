import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from 'src/app/services/autenticacion.service';

@Component({
  selector: 'app-reparaciones',
  templateUrl: './reparaciones.component.html',
  styleUrls: ['./reparaciones.component.scss'],
})
export class ReparacionesComponent  implements OnInit {

  selectedType: string | null = null;
  tiposFiltrados: any[] = [];
  tipoSeleccionado: any = null;
  modelosFiltrados: any[] = [];
  modeloSeleccionado: any = null;

  detalleProblema: string = '';
  gravedadProblema: string = '';
  emailContacto: string = '';

  reparacionesActivas: any[] = [];

  tipos = [
    { id: 1, name: 'PlayStation', type: 'consola', imageUrl: '../../assets/gallery/public/consola02.jpg' },
    { id: 2, name: 'Xbox', type: 'consola', imageUrl: '../../assets/gallery/public/consola07.jpg' },
    { id: 3, name: 'Nintendo', type: 'consola', imageUrl: '../../assets/gallery/public/consola12.jpg' },
    { id: 4, name: 'Periféricos', type: 'consola', imageUrl: '../../assets/gallery/public/consola10.jpg' },
    { id: 5, name: 'Móviles iPhone', type: 'dispositivo', imageUrl: '../../assets/gallery/public/device01.jpg' },
    { id: 6, name: 'Móviles Android', type: 'dispositivo', imageUrl: '../../assets/gallery/public/device02.jpg' },
    { id: 7, name: 'Tablets', type: 'dispositivo', imageUrl: '../../assets/gallery/public/device03.jpg' },
    { id: 8, name: 'Portátiles', type: 'dispositivo', imageUrl: '../../assets/gallery/public/device04.jpg' }
  ];

  modelos = [
    { id: 1, name: 'PlayStation 5', tipoId: 1 },
    { id: 2, name: 'PlayStation 4', tipoId: 1 },
    { id: 3, name: 'Xbox Series X', tipoId: 2 },
    { id: 4, name: 'Xbox One', tipoId: 2 },
    { id: 5, name: 'Nintendo Switch', tipoId: 3 },
    { id: 6, name: 'Mando', tipoId: 4 },
    { id: 7, name: 'Auriculares', tipoId: 4 },
    { id: 8, name: 'iPhone 12', tipoId: 5 },
    { id: 9, name: 'iPhone 11', tipoId: 5 },
    { id: 10, name: 'Samsung Galaxy S21', tipoId: 6 },
    { id: 11, name: 'Samsung Galaxy S20', tipoId: 6 },
    { id: 12, name: 'iPad', tipoId: 7 },
    { id: 13, name: 'Tablet Samsung', tipoId: 7 },
    { id: 14, name: 'MacBook Pro', tipoId: 8 },
    { id: 15, name: 'Portátil HP', tipoId: 8 }
  ];

  constructor(private autenticacionService: AutenticacionService) {}

  ngOnInit() {
    // Prellenar el email de contacto con el email del usuario actual
    this.autenticacionService.obtenerUsuario().subscribe(usuario => {
      this.emailContacto = usuario.email;
      this.cargarReparacionesActivas();
    });
    this.selectedType = 'consola';
    this.filtrarTipos();
  }

  estadosReparacion: string[] = ['Pendiente', 'En progreso', 'Esperando Piezas', 'Listo para Recoger'];

  // Método para calcular el progreso basado en el estado
  calcularProgreso(status: string): number {
    const index = this.estadosReparacion.indexOf(status);
    return index >= 0 ? (index + 1) / this.estadosReparacion.length : 0;
  }

  cargarReparacionesActivas() {
    this.autenticacionService.obtenerReparacionesActivas().subscribe(reparaciones => {
      console.log('Reparaciones activas:', reparaciones);
      this.reparacionesActivas = reparaciones;
    });
  }

  enviarFormulario() {
    const reparacionData = {
      description: this.detalleProblema
    };

    this.autenticacionService.crearReparacion(reparacionData).subscribe(
      response => {
        console.log('Reparación creada:', response);
        // Opcional: Recargar la lista de reparaciones activas
        this.cargarReparacionesActivas();
      },
      error => {
        console.error('Error al crear la reparación:', error);
      }
    );
  }

  filtrarTipos() {
    // Filtra los tipos según el tipo seleccionado (consola o dispositivo)
    this.tiposFiltrados = this.tipos.filter(tipo => tipo.type === this.selectedType);
    this.tipoSeleccionado = null;
    this.modeloSeleccionado = null;
  }

  seleccionarTipo(tipo: any) {
    // Guarda el tipo seleccionado y filtra los modelos de este tipo
    this.tipoSeleccionado = tipo;
    this.modelosFiltrados = this.modelos.filter(modelo => modelo.tipoId === tipo.id);
    this.modeloSeleccionado = null;
  }


  esEstadoActual(status: string, estado: string): boolean {
    return this.estadosReparacion.indexOf(estado) <= this.estadosReparacion.indexOf(status);
  }
}
