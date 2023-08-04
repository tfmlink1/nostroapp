import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalheMesaPage } from './detalhe-mesa';

@NgModule({
  declarations: [
    DetalheMesaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalheMesaPage),
  ],
})
export class DetalheMesaPageModule {}
