import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TramitarPage } from './tramitar.page';

const routes: Routes = [
  {
    path: '',
    component: TramitarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TramitarPageRoutingModule {}
