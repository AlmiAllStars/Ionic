import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlquilerPage } from './alquiler.page';

const routes: Routes = [
  {
    path: '',
    component: AlquilerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlquilerPageRoutingModule {}
