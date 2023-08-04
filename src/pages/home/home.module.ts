import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
@NgModule({
    declarations: [ 
        HomePage
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        //IonicPageModule.forChild(MapComponent)
    ],
    exports: [
        HomePage
    ]

})
export class HomePageModule{ }