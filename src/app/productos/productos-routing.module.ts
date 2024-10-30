import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosPage } from './productos.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage,
    children: [
      {
        path: '',
        redirectTo: 'venta',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosPageRoutingModule {}
