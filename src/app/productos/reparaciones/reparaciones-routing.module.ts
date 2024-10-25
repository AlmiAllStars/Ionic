import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReparacionesPage } from './reparaciones.page';

const routes: Routes = [
  {
    path: '',
    component: ReparacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReparacionesPageRoutingModule {}
