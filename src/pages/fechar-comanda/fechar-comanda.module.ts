import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FecharComandaPage } from './fechar-comanda';
import { LottieAnimationViewModule } from 'ng-lottie';

@NgModule({
  declarations: [
    FecharComandaPage,
  ],
  imports: [
    IonicPageModule.forChild(FecharComandaPage),
    LottieAnimationViewModule
  ],
})
export class FecharComandaPageModule {}
