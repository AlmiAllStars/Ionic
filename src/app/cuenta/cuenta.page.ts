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
  baseUrl: string = 'http://54.165.248.142:8080';

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
      if (this.fieldToEdit === 'contraseña') {
        if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
          this.showToast('Por favor, complete todos los campos de contraseña');
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          this.showToast('Las contraseñas no coinciden');
          return;
        }
        this.editValue = this.newPassword; // Actualizar contraseña
      }
  
      this.autenticacionService.actualizarUsuario(this.user!.id, { [this.mapFieldToBackend(this.fieldToEdit)]: this.editValue }).subscribe({
        next: () => {
          this.showToast('Cambios guardados');
          this.closeEditModal();

        },
        error: (err) => {
          this.showToast('Error al guardar cambios: ' + err.message);
        }
      });

      if (this.fieldToEdit) {
        this.autenticacionService.actualizarUsuarioLocal(this.fieldToEdit, this.editValue);
      };
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
