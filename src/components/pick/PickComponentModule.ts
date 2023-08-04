import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickComponent } from './pick';
import { MapComponent } from '../../components/map/map';
@NgModule({
    declarations: [ 
        PickComponent,
        MapComponent
    ],
    imports: [
        IonicPageModule.forChild(PickComponent),
        //IonicPageModule.forChild(MapComponent)
    ],
    exports: [
        PickComponent
    ]

})
export class PickComponentModule{ }