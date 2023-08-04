import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionarProdutoPage } from './adicionar-produto';
import { LottieAnimationViewModule } from 'ng-lottie';
@NgModule({
  declarations: [
    AdicionarProdutoPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionarProdutoPage),
    LottieAnimationViewModule
  ],
})
export class AdicionarProdutoPageModule {}
