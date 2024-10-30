import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TramitarPageRoutingModule } from './tramitar-routing.module';

import { TramitarPage } from './tramitar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TramitarPageRoutingModule
  ],
  declarations: [TramitarPage]
})
export class TramitarPageModule {}
