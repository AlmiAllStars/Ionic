import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlPanelPageRoutingModule } from './control-panel-routing.module';

import { ControlPanelPage } from './control-panel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlPanelPageRoutingModule
  ],
  declarations: [ControlPanelPage]
})
export class ControlPanelPageModule {}
