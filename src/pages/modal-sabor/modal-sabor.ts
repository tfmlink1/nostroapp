import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ProdutoService } from '../../services/produto.service';

/**
 * Generated class for the ModalSaborPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-sabor',
  templateUrl: 'modal-sabor.html',
})
export class ModalSaborPage {

  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public produtoService: ProdutoService,
    public navParams: NavParams) {
  }

  sabores;
  saboresInit = [];
  maximoSabores = 1;
  selecionados = [];
  jaSelecionados = [];
  blockBotao = false;
  pesquisa = '';
  ionViewDidLoad() {
    let tamanho = this.navParams.get("tamanho");
    let saborPrincipal = this.navParams.get("saborPrincipal");
    this.selecionados = this.jaSelecionados = this.navParams.get("selecionados");
    this.getSabores(tamanho, saborPrincipal);
  }

  busca() {
    this.sabores = this.saboresInit;
    if (this.pesquisa.length > 1) {
      let v = this.sabores.filter
      (el => 
        el.produto.produto.nome.toLowerCase().includes(this.pesquisa));
      this.sabores = v;
    }
  }

  getSabores(tamanho, saborPrincipal) {
    this.produtoService.saboresPorTamanho(tamanho, saborPrincipal)
      .subscribe(
        data => {
          this.validaJaSelecionado(data, (res) => {
            this.saboresInit = this.sabores = res;
            console.log(res)
            if (this.sabores[0]) this.maximoSabores = this.sabores[0].maximo_sabores - 1;
            this.validaSabores();
          });

        },
        err => {
          console.log("erro: " + err)
        }
      )
  }

  validaSabores() {
    console.log("samores: " + this.maximoSabores)
    if (this.maximoSabores < 1) {
      let toast = this.toastCtrl.create({
        message: 'Tamanho para 1 sabor, selecione outro',
        duration: 3000,
        position: 'top'
      });

      toast.present();
      this.dissmiss();
    }
  }

  validaJaSelecionado(data, call) {
    let temp = [];
    data.map((s) => {
      if (this.jaSelecionados.length == 0) {
        s.selecionado = false;

      } else {
        this.percorreSelecionados(s, (res) => {

          if (res) s.selecionado = true;
          else s.selecionado = false;
        })
      }
      temp.push(s)
    })
    call(temp);
  }


  percorreSelecionados(sabor, call) {
    let retorno = false;
    this.jaSelecionados.map((j) => {
      if (j.produto_id == sabor.produto_id) retorno = true;
    })
    call(retorno);
  }

  select(sabor) {
    this.verificaSaborJaIncluido(sabor, (res) => {
      if (res == false) this.selecionados.push(sabor)
      else this.deleteSabor(sabor);
    })
    if (this.selecionados.length >= this.maximoSabores) {

      let toast = this.toastCtrl.create({
        message: 'Maximo de sabores adicionados',
        duration: 3000,
        position: 'top'
      });

      toast.present();
    }

    if (this.selecionados.length > this.maximoSabores) {
      this.blockBotao = true;
    } else {
      this.blockBotao = false;
    }

  }

  verificaSaborJaIncluido(sabor, call) {
    let retorno = false;
    this.selecionados.map((v) => {
      if (v.id == sabor.id) {
        retorno = true;
      }
    })
    call(retorno);
  }

  deleteSabor(sabor) {
    let temp = [];
    this.selecionados.map((v) => {
      if (v.id != sabor.id) temp.push(v)
    });
    this.selecionados = temp;
  }

  dissmiss() {

    this.viewCtrl.dismiss(this.selecionados);
  }

}
