import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private notificationsSubject = new BehaviorSubject<any[]>([
    { id: '1', text: 'Tienes un nuevo mensaje', icon: 'mail-outline', leida: false },
    { id: '2', text: 'Tu pedido ha sido enviado', icon: 'cube-outline', leida: false },
    { id: '3', text: 'Actualización del sistema disponible', icon: 'cloud-download-outline', leida: false },
    { id: '4', text: 'Solicitud de amistad aceptada', icon: 'person-add-outline', leida: false }
  ]);
  public notifications$: Observable<any[]> = this.notificationsSubject.asObservable();

  addNotification(notification: any) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
  }

  removeNotification(notificationId: string) {
    const updatedNotifications = this.notificationsSubject.value.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(updatedNotifications);
  }

  clearNotifications() {
    this.notificationsSubject.next([]);
  }
}
