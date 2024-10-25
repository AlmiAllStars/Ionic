import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosPage } from './productos.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage,
    children: [
      {
        path: 'venta',
        loadChildren: () => import('./venta/venta.module').then(m => m.VentaPageModule)
      },
      {
        path: 'alquiler',
        loadChildren: () => import('./alquiler/alquiler.module').then(m => m.AlquilerPageModule)
      },
      {
        path: 'reparaciones',
        loadChildren: () => import('./reparaciones/reparaciones.module').then(m => m.ReparacionesPageModule)
      },
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
