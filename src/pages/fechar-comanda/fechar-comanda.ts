import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ComandaService } from '../../services/comanda.service';
import { LottieAnimationViewModule } from 'ng-lottie';
import { Vibration } from '@ionic-native/vibration';

/**
 * Generated class for the FecharComandaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fechar-comanda',
  templateUrl: 'fechar-comanda.html',
})
export class FecharComandaPage {
  pedido_id;
  lottieConfig: any;
  sucesso = false;
  tiposPagamento = [
    { cod: '01', nome: 'Dinheiro' },
    { cod: '02', nome: 'Cheque' },
    { cod: '03', nome: 'Cartão de Crédito' },
    { cod: '04', nome: 'Cartão de Débito' },
    { cod: '05', nome: 'Crédito Loja' },
    { cod: '10', nome: 'Vale Alimentação' },
    { cod: '11', nome: 'Vale Refeição' },
    { cod: '12', nome: 'Vale Presente' },
    { cod: '13', nome: 'Vale Combustível' },
    { cod: '14', nome: 'Duplicata Mercantil' },
    { cod: '15', nome: 'Boleto Bancário' },
    { cod: '90', nome: 'Sem pagamento' },
    { cod: '99', nome: 'Outros' }
  ];
  dinheiro_recebido = 0;
  tipo_pagamento;
  observacao = "";
  total = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private vibration: Vibration,
    public comandaService: ComandaService
  ) {
    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
      path: 'assets/success.json',
      autoplay: true,
      loop: false
    }
    this.pedido_id = this.navParams.get("comanda_id");
    this.total = this.navParams.get("total");
    // this.pedido_id = 1;
    console.log(this.pedido_id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FecharComandaPage');
  }

  fecharComanda(){
    let usuario = JSON.parse(window.localStorage['usuario']);
    let usuario_id = usuario.id
    let js = {
      pedido_id: this.pedido_id,
      observacao: this.observacao,
      dinheiro_recebido: this.dinheiro_recebido,
      tipo_pagamento: this.tipo_pagamento,
      usuario_id: usuario_id
    }
    let json = JSON.stringify(js);
    this.comandaService.fecharComanda(json)
    .subscribe(
      data => {
        console.log(data)
        this.sucesso = true;
          this.vibration.vibrate([100, 150, 100]);
          setTimeout(() => {
            this.navCtrl.setRoot('HomePage');
          }, 2000)
      },
      err => {
        console.log(err)
      }
    )

  }

  fechar() {
    const prompt = this.alertCtrl.create({
      title: 'Fechar Comanda',
      message: "Deseja fechar esta comanda?",
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sim',
          handler: data => {
            console.log('Saved clicked');
            this.fecharComanda()
          }
        }
      ]
    });
    prompt.present();
  }

}
