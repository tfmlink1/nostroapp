import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { ComandaService } from '../../services/comanda.service';

/**
 * Generated class for the AbrirComandaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-abrir-comanda',
  templateUrl: 'abrir-comanda.html',
})
export class AbrirComandaPage {
  mesas:any;
  mesa = 0;
  comanda = 0;
  constructor(public navCtrl: NavController, 
    public comandaService: ComandaService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
      this.getMesas();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AbrirComandaPage');
  }

  getMesas(){
    this.comandaService.getMesasTodas().subscribe(
      data => {
        console.log(data)
        this.mesas = data;
      },
      err => {
        console.log(err)
      }
    )
  }

  presentLoading(mensagem) {
    let present = this.loadingCtrl.create({
      content: mensagem,
      duration: 4000,
      dismissOnPageChange: true
    });
    return present;
  }

  postComanda() {
    let present = this.presentLoading('Enviando dados..');
    present.present();

    this.comandaService.open(this.comanda, this.mesa)
      .subscribe(
        data => {
          present.dismiss();
          console.log(data)
          if (data) {
            this.viewCtrl.dismiss();
          } else {
            this.alert("Esta comanda já esta ativa!");
          }
        }, err => {
          present.dismiss();
          console.log(err)
        }
      )
  }

  alert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: msg,
      buttons: ['Fechar']
    });
    alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
