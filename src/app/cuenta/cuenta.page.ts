import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Usuario } from '../models/usuario';
import { AutenticacionService } from '../services/autenticacion.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  user: Usuario | null = null; // Para almacenar el usuario obtenido del servicio
  isEditModalOpen = false;
  fieldToEdit: keyof Usuario | null = null;
  newFieldValue: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  editValue: string = '';
  defaultImage: string = '../../assets/images/default-placeholder.png';
  baseUrl: string = 'https://juegalmiapp.duckdns.org';
  

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private autenticacionService: AutenticacionService,
    private navController: NavController
  ) {}

  ngOnInit() {
    // Obtener usuario al inicializar la página
    this.autenticacionService.obtenerUsuario().subscribe(usuario => {
      this.user = usuario;
    });
  }

  openEditModal(field: keyof Usuario) {
    this.fieldToEdit = field;
    this.newFieldValue = this.user ? this.user[field]?.toString() || '' : '';
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editValue = '';
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImage; // Imagen de prueba si no se encuentra la original
  }  

  async saveChanges() {
    if (this.fieldToEdit) {
      // Validación de contraseña
      if (this.fieldToEdit === 'contraseña') {
        if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
          this.showToast('Por favor, complete todos los campos de contraseña');
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          this.showToast('Las contraseñas no coinciden');
          return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(this.newPassword)) {
          this.showToast('La contraseña debe tener entre 8 y 20 caracteres, e incluir al menos una letra y un número');
          return;
        }
        this.editValue = this.newPassword; // Actualizar contraseña
      } else {
        // Validar otros campos según el campo a editar
        if (!this.validarCampo(this.fieldToEdit, this.editValue)) {
          this.showToast(this.getErrorMessage(this.fieldToEdit));
          return;
        }
      }
  
      // Actualización en el servidor
      this.autenticacionService.actualizarUsuario(this.user!.id, { [this.mapFieldToBackend(this.fieldToEdit)]: this.editValue }).subscribe({
        next: () => {
          this.showToast('Cambios guardados');
          this.closeEditModal();
        },
        error: (err) => {
          this.showToast('Error al guardar cambios: ' + err.message);
        }
      });
  
      // Actualización local
      this.autenticacionService.actualizarUsuarioLocal(this.fieldToEdit, this.editValue);
    }
  }
  
  
  // Validación general
  validarCampo(campo: string, valor: string): boolean {
    let regex: RegExp;
  
    switch (campo) {
      case 'name':
      case 'apellido':
        regex = /^[a-zA-Z\s]{2,}$/;
        break;
      case 'telefono':
        regex = /^\d{7,15}$/;
        break;
      case 'dirección':
        regex = /^[a-zA-Z0-9\s,.-]{5,}$/;
        break;
      case 'código postal':
        regex = /^\d{4,5}$/;
        break;
      default:
        return true; // No requiere validación específica
    }
  
    return regex.test(valor);
  }
  
  // Mensajes personalizados para errores
  getErrorMessage(campo: string): string {
    switch (campo) {
      case 'nombre':
      case 'apellido':
        return 'Debe contener solo letras y al menos 2 caracteres.';
      case 'telefono':
        return 'Debe contener entre 7 y 15 dígitos.';
      case 'dirección':
        return 'Debe contener al menos 5 caracteres.';
      case 'código postal':
        return 'Debe contener entre 4 y 5 dígitos.';
      case 'contraseña':
        return 'Debe tener entre 8 y 20 caracteres, incluyendo al menos una letra y un número.';
      default:
        return 'Valor no válido.';
    }
  }
  
  closePage() {
    this.navController.back();
  }


  private mapFieldToBackend(field: string): string {
    const fieldMapping: { [key: string]: string } = {
      nombre: 'name',
      apellido: 'surname',
      email: 'email',
      telefono: 'phone',
      direccion: 'address',
      codigoPostal: 'postal_code',
      contraseña: 'password',
      // Añade otros campos según sea necesario
    };
  
    return fieldMapping[field] || field;
  }
  

  async uploadImage() {
    this.showToast('Funcionalidad de subir imagen en desarrollo');
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}
