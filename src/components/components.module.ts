import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { PickupComponent } from './pickup/pickup';
import { PickComponent } from './pick/pick';
@NgModule({
	declarations: [MapComponent,
    PickupComponent,
    PickComponent],
	imports: [],
	exports: [MapComponent,
    PickupComponent,
    PickComponent]
})
export class ComponentsModule {}
