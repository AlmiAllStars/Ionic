import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosPage } from './productos.page';
import { VideojuegosComponent } from './videojuegos/videojuegos.component';
import { ConsolasComponent } from './consolas/consolas.component';
import { DevicesComponent } from './devices/devices.component';
import { ReparacionesComponent } from './reparaciones/reparaciones.component';

const routes: Routes = [
  {
    path: '',
    component: ProductosPage,
    children: [
      {
        path: 'videojuegos',
        component: VideojuegosComponent,
      },
      {
        path: 'consolas',
        component: ConsolasComponent,
      },
      {
        path: 'devices',
        component: DevicesComponent,
      },
      {
        path: 'reparaciones',
        component: ReparacionesComponent,
      },
      {
        path: '',
        redirectTo: 'videojuegos',
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
