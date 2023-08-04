import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetalheMesaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalhe-mesa',
  templateUrl: 'detalhe-mesa.html',
})
export class DetalheMesaPage {
  mesa: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.mesa = this.navParams.get('mesa');
    console.log(this.mesa)
  }

  ionViewDidLoad() {
    
  }

  itensComanda(c){
    this.navCtrl.push('ItemComandaPage', { comanda: c });
  }

}
