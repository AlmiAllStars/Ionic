import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductosPage } from './productos.page';
import { ProductosPageRoutingModule } from './productos-routing.module';
import { FormsModule } from '@angular/forms';  // Importamos FormsModule

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProductosPageRoutingModule,
    FormsModule  // Asegúrate de incluir FormsModule aquí
  ],
  declarations: [ProductosPage]
})
export class ProductosPageModule {}
