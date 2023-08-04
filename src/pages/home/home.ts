import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { ProdutoService } from '../../services/produto.service';

@IonicPage(
)
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  produtos;
  categorias;
  myInput;
  categoriaSelecionada
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public produtoService: ProdutoService) {
  }

  presentLoading() {
    let present = this.loadingCtrl.create({
      content: 'Buscando...',
      duration: 4000,
      dismissOnPageChange: true
    });
    return present;
  }

  ionViewDidLoad() {
    if (window.localStorage['api']) {
      // this.getMaisVendidos();
      this.getCategorias();
    } else {
      alert('Nao foi possivel identificar o path da Servidor')
    }
  }

  add(produto) {
    this.navCtrl.push('AdicionarProdutoPage', { produto: produto })
  }

  onInput() {
    if (this.myInput.length > 1) {
      this.produtoService.pesquisa(this.myInput)
        .subscribe(
          data => {
            console.log(data);
            this.produtos = data
          }, err => {
            console.error(err);
          }
        )
    }
  }

  getMaisVendidos() {
    let present = this.presentLoading();
    present.present();
    this.produtoService.maisPedidos()
      .subscribe(
        data => {
          console.log(data)
          this.produtos = data;
          present.dismiss();
        }, err => {
          console.error(err)
          present.dismiss();
          alert('Verifique o path do servidor')

        }
      )
  }

  getCategorias() {
    let present = this.presentLoading();
    present.present();
    this.produtoService.categorias()
      .subscribe(
        data => {
          console.log(data[0].produtos)
          this.categorias = data;
          this.produtos = data[0].produtos
          present.dismiss();
        }, err => {
          console.error(err)
          present.dismiss();
          alert('Verifique o path do servidor')

        }
      )
  }

  verMesas() {
    this.navCtrl.push('MesasPage');
  }

  verComandas() {
    this.navCtrl.push('ComandasPage');
  }

  AddItens(){
    this.navCtrl.push('AdicionarItensPage', {comanda_id: null});
  }

  selecionaCategoria(categoria){
    console.log(categoria)
    this.categoriaSelecionada = categoria.id
    this.produtos = categoria.produtos
  }

}
