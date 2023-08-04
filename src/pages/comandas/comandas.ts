import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { ComandaService } from '../../services/comanda.service';

/**
 * Generated class for the ComandasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comandas',
  templateUrl: 'comandas.html',
})
export class ComandasPage {
  comandas: any[];
  comandasFilter: any[];
  nenhumaComanda = false;
  erro = false;
  myInput;

  comandasAbertas = 0;
  total = 0.00;
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public comandaService: ComandaService,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getComandasAbertas()
  }

  onInput() {
    if (this.myInput.length > 0) {
      let filter = this.comandasFilter.filter((x) => {
        if(x.comanda == this.myInput) return x
      })
      console.log(filter)
      this.comandas = filter
    }
  }

  getComandasAbertas() {
    let present = this.presentLoading('Buscando...');
    present.present();
    this.comandaService.getOpen()
      .subscribe(
        data => {
          present.dismiss();
          console.log(data)
          this.comandasFilter = this.comandas = data;
          this.comandasAbertas = this.comandas.length;
          this.somaTotal(data);
          if (data.length == 0) this.nenhumaComanda = true;
        },
        err => {
          present.dismiss();
          console.error(err)
          this.erro = true;
        }
      )
  }

  somaTotal(data) {
    data.map((v) => {
      this.total += v.soma
    })
  }

  abrir() {
    this.showPrompt();
  }

  itens(c) {
    this.navCtrl.push('ItemComandaPage', { comanda: c });
  }

  modalNovaComanda() {
    let profileModal = this.modalCtrl.create('AbrirComandaPage');
    profileModal.present();
    profileModal.onDidDismiss(data => {
      console.log("Retornou");
      location.reload();
    });
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Abrir Comanda',
      message: "Informe o código de identificaçaão da comanda",
      inputs: [
        {
          name: 'cod',
          placeholder: 'Código',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Abrir',
          handler: data => {

          }
        }
      ]
    });
    prompt.present();
  }

  presentLoading(mensagem) {
    let present = this.loadingCtrl.create({
      content: mensagem,
      duration: 4000,
      dismissOnPageChange: true
    });
    return present;
  }


  alert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: msg,
      buttons: ['Fechar']
    });
    alert.present();
  }


}
