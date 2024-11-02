import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductosPage } from './productos.page';
import { ProductosPageRoutingModule } from './productos-routing.module';
import { FormsModule } from '@angular/forms';  // Importamos FormsModule
import { register } from 'swiper/element/bundle';
import { VideojuegosComponent } from './videojuegos/videojuegos.component';
import { ConsolasComponent } from './consolas/consolas.component';
import { DevicesComponent } from './devices/devices.component';
import { ReparacionesComponent } from './reparaciones/reparaciones.component';
import { RouterModule } from '@angular/router';

register();

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProductosPageRoutingModule,
    FormsModule,  // Asegúrate de incluir FormsModule aquí
    RouterModule
  ],
  declarations: [
    ProductosPage,
    VideojuegosComponent,
    ConsolasComponent,
    DevicesComponent,
    ReparacionesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductosPageModule {}
