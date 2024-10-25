import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlPanelPage } from './control-panel.page';

const routes: Routes = [
  {
    path: '',
    component: ControlPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlPanelPageRoutingModule {}
