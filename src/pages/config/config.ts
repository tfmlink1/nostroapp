import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ComandaService } from '../../services/comanda.service';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {
  path = "http://dominio.com.br";
  usuario = "";
  senha = "";
  usuarioConectado = ""
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public comandaService: ComandaService,
    public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
    let api = window.localStorage['api'];
    if (api) {
      let usuario = JSON.parse(window.localStorage['usuario']);
      if (api && usuario) {

        this.showPromptAcesso()
        this.path = api;
        this.usuario = usuario.login

        this.usuarioConectado = usuario.nome;
      } else {

      }
    }
  }

  salvar() {
    let json = {
      usuario: this.usuario,
      senha: this.senha
    }

    let temp = JSON.stringify(json);
    this.comandaService.autenticar(this.path, temp).subscribe(
      success => {
        console.log(success)
        window.localStorage['api'] = this.path;
        window.localStorage['usuario'] = JSON.stringify(success);
        alert('Sucesso, reinicie o App');
        this.navCtrl.setRoot('HomePage');
      }, err => {
        console.log(err)
        window.localStorage['api'] = ''
        window.localStorage['usuario'] = ''
        alert('Não foi possivel se conectar')
      }
    )
  }

  showPromptAcesso() {
    this.comandaService.senhaParaAcesso(window.localStorage['api'])
      .subscribe(
        success => {
          console.log(success)
          this.prompt(success)
        },
        err => {
          alert('erro ao buscar senha para acesso')
        }
      )

  }

  prompt(senha) {
    const prompt = this.alertCtrl.create({
      title: 'Config',
      message: "Informe a senha",
      inputs: [
        {
          name: 'senha',
          placeholder: 'Senha'
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
          text: 'OK',
          handler: data => {
            if (data.senha != senha) {
              this.navCtrl.setRoot('HomePage');
            }
          }
        }
      ]
    });
    prompt.present();
  }

}
