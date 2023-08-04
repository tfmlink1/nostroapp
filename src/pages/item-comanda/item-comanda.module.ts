import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemComandaPage } from './item-comanda';
import { LottieAnimationViewModule } from 'ng-lottie';

@NgModule({
  declarations: [
    ItemComandaPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemComandaPage),
    LottieAnimationViewModule
  ],
})
export class ItemComandaPageModule {}
