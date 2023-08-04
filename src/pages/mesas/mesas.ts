import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ComandaService } from '../../services/comanda.service';

/**
 * Generated class for the MesasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mesas',
  templateUrl: 'mesas.html',
})
export class MesasPage {
  mesas: any[];
  constructor(
    public navCtrl: NavController,
    public comandaService: ComandaService,
    public navParams: NavParams) {
      this.getMesas();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MesasPage');
  }

  getMesas() {
    this.comandaService.getMesas()
      .subscribe(
        data => {
          console.log(data)
          this.mesas = data
        },
        err => {
          console.log(err)
          alert("Erro ao buscar mesas!")
        }
      )
  }

  detaheMesa(mesa){
    this.navCtrl.push('DetalheMesaPage', {mesa: mesa})
  }

}
