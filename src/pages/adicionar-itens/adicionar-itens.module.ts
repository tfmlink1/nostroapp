import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionarItensPage } from './adicionar-itens';
import { LottieAnimationViewModule } from 'ng-lottie';

@NgModule({
  declarations: [
    AdicionarItensPage,
    
  ],
  imports: [
    IonicPageModule.forChild(AdicionarItensPage),
    LottieAnimationViewModule
  ],
})
export class AdicionarItensPageModule {}
