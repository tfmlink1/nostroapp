import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComandasPage } from './comandas';

@NgModule({
  declarations: [
    ComandasPage,
  ],
  imports: [
    IonicPageModule.forChild(ComandasPage),
  ],
})
export class ComandasPageModule {}
