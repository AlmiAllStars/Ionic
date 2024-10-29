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

  async saveChanges() {
    if (this.fieldToEdit) {
      if (this.fieldToEdit === 'contraseña') {
        // Validación para la contraseña
        if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
          this.showToast('Por favor, complete todos los campos de contraseña');
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          this.showToast('Las contraseñas no coinciden');
          return;
        }
        // Aquí puedes añadir lógica adicional para verificar la contraseña anterior
        this.user!.contraseña = this.newPassword;
      } else {
        // Actualización de otros campos
        (this.user as any)[this.fieldToEdit] = this.editValue;
      }

      // Guardar cambios a través del servicio
      this.autenticacionService.actualizarUsuario(this.user!.id, { [this.fieldToEdit]: this.editValue }).subscribe(() => {
        this.showToast('Cambios guardados');
        this.closeEditModal();
      });
    }
  }

  closePage() {
    this.navController.back();
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
