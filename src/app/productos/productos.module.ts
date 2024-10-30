import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductosPage } from './productos.page';
import { ProductosPageRoutingModule } from './productos-routing.module';
import { FormsModule } from '@angular/forms';  // Importamos FormsModule
import { register } from 'swiper/element/bundle';

register();

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProductosPageRoutingModule,
    FormsModule  // Asegúrate de incluir FormsModule aquí
  ],
  declarations: [ProductosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductosPageModule {}
