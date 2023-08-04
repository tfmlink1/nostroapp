import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { ComandaService } from '../../services/comanda.service';
import { LottieAnimationViewModule } from 'ng-lottie';
import { ProdutoService } from '../../services/produto.service';
import { Vibration } from '@ionic-native/vibration';
/**
 * Generated class for the AdicionarProdutoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adicionar-produto',
  templateUrl: 'adicionar-produto.html',
})
export class AdicionarProdutoPage implements OnInit {
  tipoPesquisa = 'comanda'
  produto: any;
  comandas: any;
  comandasFilter: any;
  mesas: any;
  mesasFilter: any;
  adicionaisInicio: any;
  tamanhosDePizza: any;
  nenhumaComanda = false;
  erro = false;
  sucesso = false;
  quantidade = 1;
  comanda = 0;
  codComanda = 0;
  obs = '';
  lottieConfig: any;
  produtoPizza = false;
  tamanhoSelecionado = null;
  saboresExtrasPizza = [];
  myAdicional;
  adicionais;
  adicionaisSelecionados = [];
  valorPizzaPorTamanho = 0;
  totalSabores = 0;
  valorFlex = 0;
  divideValorPizza = 0;
  mesaNova = 0;
  novaComanda = 0;

  escolhaComandaMesa = false

  myInput;
  myInput2 = '';
  constructor(public navCtrl: NavController,
    public comandaService: ComandaService,
    private vibration: Vibration,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public navParams: NavParams) {
    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
      path: 'assets/success.json',
      autoplay: true,
      loop: false
    }
    this.getMesasTodas();
    this.produto = this.navParams.get("produto");
    this.totalSabores = 1;
    console.log(this.produto)
    this.dividePizza();
  }

  getMesasTodas() {
    this.comandaService.getMesasTodas().subscribe(
      data => {
        this.mesasFilter = this.mesas = data
      },
      err => {
        console.log(err)
        alert("Erro ao buscar mesas");
      }
    )
  }

  dividePizza() {
    this.produtoService.dividePizza()
      .subscribe(
        data => {
          if (data == 1) {
            this.divideValorPizza = 1;
          }
        },
        err => {
          console.log(err)
        }
      )
  }

  buscaValorPizza() {
    this.totalSabores = 1;
    this.saboresExtrasPizza = [];
    this.produtoService.pizzaValorPorTamanho(this.tamanhoSelecionado, this.produto.id)
      .subscribe(
        data => {
          let valor: any = data
          this.valorPizzaPorTamanho = valor
        },
        err => {
          console.log(err)
        }
      )
  }

  ngOnInit(): void {
    if (this.produto.categoria.nome.includes('izza')) {
      this.produtoPizza = true;
      this.tamanhosPizza();
      //buscando o tamanho das pizzas
    }
    this.getComandasAbertas();
    this.getAdicionais();
  }

  ionViewDidLoad() {

  }

  addSabor() {
    console.log(this.saboresExtrasPizza)
    if (this.tamanhoSelecionado) {
      let modal = this.modalCtrl.create('ModalSaborPage',
        {
          tamanho: this.tamanhoSelecionado, saborPrincipal: this.produto.id,
          selecionados: this.saboresExtrasPizza
        });
      modal.present();
      modal.onDidDismiss((selecionados) => {
        let maiorValor = this.valorPizzaPorTamanho;
        let somaValores = Number(maiorValor);
        console.log(maiorValor)
        selecionados.map((s) => {
          if (s.valor > maiorValor) {
            maiorValor = s.valor
          }
          somaValores += Number(s.valor);
        })
        console.log(somaValores)
        if (this.divideValorPizza == 1) {
          maiorValor = (somaValores / (selecionados.length + 1))
        }
        this.valorPizzaPorTamanho = maiorValor;
        this.saboresExtrasPizza = selecionados;

        if (this.saboresExtrasPizza.length == 0) this.totalSabores = 1;
        else this.totalSabores += this.saboresExtrasPizza.length;
      })
    } else {
      let alert = this.alertCtrl.create({
        title: 'Erro',
        subTitle: 'Selecione o tamanho',
        buttons: ['Fechar']
      });
      alert.present();
    }
  }

  onInput() {
    if (this.myInput.length > 0) {
      if (this.tipoPesquisa == 'comanda') {
        let filter = this.comandasFilter.filter((x) => {
          if (x.comanda == this.myInput) return x
        })
        console.log(filter)
        this.comandas = filter
      } else {
        console.log('filtro por comanda ..')
        let filter = this.comandasFilter.filter((x) => {
          if (x.mesa) {
            if (x.mesa.nome.toLowerCase().includes(this.myInput.toLowerCase())) return x;
          }
        })
        console.log(filter)
        this.comandas = filter
      }
    } else {
      this.comandas = this.comandasFilter
    }
  }

  onInput2() {
    if (this.myInput2.length > 0) {

      let filter = this.mesasFilter.filter((x) => {
        if (x.id == this.myInput2) return x
      })
      console.log(filter)
      this.mesas = filter

    } else {
      this.mesas = this.mesasFilter
    }

  }

  selectmesa(id){
    console.log(id)
    this.mesaNova = id
  }

  adicionar() {
    let loading = this.presentLoading('Salvando...');
    loading.present();
    let usr = JSON.parse(window.localStorage.getItem('usuario'));
    if (this.valorFlex == 0 && (this.produto.valor_livre == '1' ||
      this.produto.valor_livre == 1)) {
      this.alert("Infome o valor!")
    } else {
      if (this.valorFlex == 0) {
        this.valorFlex = this.produto.valor_venda;
        if (this.valorPizzaPorTamanho > 0) {
          this.valorFlex = this.valorPizzaPorTamanho;
        }
      }
      console.log(this.codComanda)
      this.comandaService.addProduto(this.codComanda, this.comanda, this.produto.id, this.quantidade,
        this.obs, this.adicionaisSelecionados, this.saboresExtrasPizza, this.tamanhoSelecionado, this.valorFlex, this.mesaNova, usr.id)
        .subscribe(
          data => {
            loading.dismiss();
            console.log(data)
            if (data) {
              this.sucesso = true;
              this.vibration.vibrate([100, 150, 100]);
              setTimeout(() => {
                this.navCtrl.setRoot('HomePage');
              }, 2000)
            } else {
              this.alert("Esta comanda já esta ativa!")
            }
          }, err => {
            loading.dismiss();
            alert('Erro ao inserir')
            console.error(err)
          }
        )
    }
  }

  alert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: msg,
      buttons: ['Fechar']
    });
    alert.present();
  }

  presentLoading(mensagem) {
    let present = this.loadingCtrl.create({
      content: mensagem,
      duration: 4000,
      dismissOnPageChange: true
    });
    return present;
  }

  apagarNumeroComanda() {
    this.codComanda = 0;
  }

  getComandasAbertas() {
    // let present = this.presentLoading('Buscando comandas em aberto...');
    // present.present();
    this.comandaService.getOpen()
      .subscribe(
        data => {
          console.log(data)
          // present.dismiss();
          this.comandasFilter = this.comandas = data;
          if (data.length == 0) this.nenhumaComanda = true;
        },
        err => {
          // present.dismiss();
          console.error(err)
        }
      )
  }

  getAdicionais() {
    let present = this.presentLoading('Buscando adicionais...');
    present.present();
    this.produtoService.adicionais()
      .subscribe(
        data => {
          present.dismiss();
          console.log(data)
          this.adicionaisInicio = data;
        },
        err => {
          console.log(err)
          present.dismiss();
        }
      )
  }

  tamanhosPizza() {
    // let present = this.presentLoading('Buscando tamanhos para pizza...');
    // present.present();
    this.produtoService.tamanhosPizza()
      .subscribe(
        data => {
          // present.dismiss();
          console.log(data)
          this.tamanhosDePizza = data;
        },
        err => {
          console.log(err)
          // present.dismiss();
        }
      )
  }


  searchAdicional() {

    if (this.myAdicional.length > 0) {
      this.adicionais = this.adicionaisInicio.filter((r) => {

        return r.nome.match(this.myAdicional)
      })
    }
  }

  selecionaAdicional(adicional) {
    this.verificaAdicionalJaIncluido(adicional, (res) => {
      if (res == false) this.adicionaisSelecionados.push(adicional);
    })
  }

  verificaAdicionalJaIncluido(adicional, call) {
    let retorno = false;
    this.adicionaisSelecionados.map((v) => {
      if (v.id == adicional.id) {
        retorno = true;
      }
    })
    call(retorno);
  }

  deleteAdicional(adicional) {
    console.log(adicional)
    let temp = [];
    this.adicionaisSelecionados.map((v) => {
      if (v.id != adicional.id) temp.push(v)
    });
    this.adicionaisSelecionados = temp;
  }


}
