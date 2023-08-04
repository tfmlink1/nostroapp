import { Component } from '@angular/core';
import { Vibration } from '@ionic-native/vibration';
import { AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ComandaService } from '../../services/comanda.service';
import { ProdutoService } from '../../services/produto.service';
import { LottieAnimationViewModule } from 'ng-lottie';

/**
 * Generated class for the AdicionarItensPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adicionar-itens',
  templateUrl: 'adicionar-itens.html',
})
export class AdicionarItensPage {
  tipoPesquisa = 'comanda'
  comanda_id = 0;
  comanda = 0;
  produtos;
  produtosFilter;
  adicionais;
  categorias;
  myAdicional;
  adicionaisInicio: any;
  obs = '';
  myInput;
  produtoSelecionado = null;
  produtoPizza = false;
  tamanhoSelecionado = null;
  tamanhosDePizza: any;
  valorFlex = 0;
  adicionaisSelecionados = [];
  valorPizzaPorTamanho = 0;
  totalSabores = 1;
  quantidade = 1;
  divideValorPizza = 0;
  saboresExtrasPizza = [];
  contProdutos = 0;
  sucesso = false;
  lottieConfig: any;
  categoriaSelecionada
  verItens = false;
  cart = [];

  codComanda = 0;
  comandas: any;
  comandasFilter: any;
  mesas: any;
  mesasFilter: any;
  nenhumaComanda = false;
  escolhaComandaMesa = false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private vibration: Vibration,
    public comandaService: ComandaService,
    private loadingCtrl: LoadingController
  ) {

    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
      path: 'assets/success.json',
      autoplay: true,
      loop: false
    }
    this.comanda_id = this.navParams.get("comanda_id");
    console.log("comanda_id", this.comanda_id)
    this.getProdutos();
    this.getCategorias();
    this.getAdicionais();
    this.dividePizza();
    this.getMesasTodas();
    this.getComandasAbertas();

  }

  ionViewDidLoad() {
    window.localStorage['cart'] = ''
    console.log('ionViewDidLoad AdicionarItensPage');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave')
  }

  getProdutos() {
    this.produtoService.all()
      .subscribe(
        resp => {
          console.log(resp)
          this.produtosFilter = resp;
        },
        err => {
          console.log(err)
        }
      )
  }

  presentLoading() {
    let present = this.loadingCtrl.create({
      content: 'Buscando...',
      duration: 4000,
      dismissOnPageChange: true
    });
    return present;
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

  getAdicionais() {
    this.produtoService.adicionais()
      .subscribe(
        resp => {
          console.log(resp)
          // this.adicionais = resp;
          this.adicionaisInicio = resp;
        },
        err => {
          console.log(err)
        }
      )
  }

  onInput() {
    if (this.myInput.length > 1) {
      this.produtoSelecionado = null;
      this.produtos = this.produtosFilter.filter(
        (element) => {
          console.log(element)
          return element.nome.toLowerCase().includes(this.myInput.toLowerCase())
        }
      );
    }
  }

  onInput2() {
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

  add(produto) {
    this.produtoSelecionado = produto;
    console.log(this.produtoSelecionado)
    if (this.produtoSelecionado.categoria.nome.includes('izza')) {
      this.produtoPizza = true;
      this.tamanhosPizza();
      //buscando o tamanho das pizzas
    }
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

  searchAdicional() {

    if (this.myAdicional.length > 0) {
      this.adicionais = this.adicionaisInicio.filter((r) => {
        return r.nome.match(this.myAdicional)
      })
    }
  }

  adicionar() {
    // let loading = this.presentLoading('Salvando...');
    // loading.present();
    if (this.valorFlex == 0 && (this.produtoSelecionado.valor_livre == '1' ||
      this.produtoSelecionado.valor_livre == 1)) {
      alert("Infome o valor!")
    } else {
      console.log(this.produtoSelecionado)

      this.valorFlex = this.produtoSelecionado.valor_venda;
      if (this.valorPizzaPorTamanho > 0) {
        this.valorFlex = this.valorPizzaPorTamanho;
      }

      setTimeout(() => {
        this.addProdutoStorage()
      }, 200)
    }
  }

  addProdutoStorage() {
    let cart = [];
    if (window.localStorage['cart']) {
      cart = JSON.parse(window.localStorage['cart']);
    }

    let json = {
      ref: Math.floor(Math.random() * 65536),
      produto_id: this.produtoSelecionado.id,
      produto_nome: this.produtoSelecionado.nome,
      quantidade: this.quantidade,
      obs: this.obs,
      adicionaisSelecionados: this.adicionaisSelecionados,
      saboresExtrasPizza: this.saboresExtrasPizza,
      valorFlex: this.valorFlex,
      tamanho: this.tamanhoSelecionado
    }
    console.log(json)
    cart.push(json);
    // console.log(cart)
    // this.vibration.vibrate([100, 150, 100]);
    window.localStorage['cart'] = JSON.stringify(cart)
    this.contCart();
    this.addProdutos()
    this.showAlert()
  }

  addProdutos() {
    console.log("voltando")
    this.verItens = false
    this.getCategorias()
  }

  removeItem(ref) {
    console.log(ref)
    let cart = [];
    let cartTemp = [];
    if (window.localStorage['cart']) {
      cart = JSON.parse(window.localStorage['cart']);
      cart.map((r) => {
        if (r.ref != ref) {
          cartTemp.push(r)
        }
      })
      setTimeout(() => {
        window.localStorage['cart'] = JSON.stringify(cartTemp)
        this.cart = cartTemp;
      }, 200)
    }
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Item Adicionado!',
      subTitle: '',
      buttons: ['OK']
    });
    alert.present();
  }

  contCart() {
    this.produtoSelecionado = null;
    this.myInput = '';
    this.produtos = []
    if (window.localStorage['cart']) {
      let cart = JSON.parse(window.localStorage['cart']);
      this.contProdutos = cart.length
    } else {
      this.contProdutos = 0;
    }
  }

  buscaValorPizza() {
    this.totalSabores = 1;
    this.saboresExtrasPizza = [];
    this.produtoService.pizzaValorPorTamanho(this.tamanhoSelecionado, this.produtoSelecionado.id)
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

  addSabor() {
    console.log(this.saboresExtrasPizza)
    if (this.tamanhoSelecionado) {
      let modal = this.modalCtrl.create('ModalSaborPage',
        {
          tamanho: this.tamanhoSelecionado, saborPrincipal: this.produtoSelecionado.id,
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
      alert('Selecione o tamanho');
    }
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

  enviarItens() {
    if (this.comanda_id != null) {
      let cart = window.localStorage['cart'];
      // this.comanda_id = 1;
      let usr = JSON.parse(window.localStorage.getItem('usuario'));
      console.log(usr)
      this.comandaService.addItens(this.comanda_id, cart, usr.id)
        .subscribe(
          resp => {
            console.log(resp)
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
    } else {
      console.log("escolha a mesa")
      this.escolhaComandaMesa = true

    }
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

  clickVerItens() {
    this.cart = JSON.parse(window.localStorage['cart']);

    console.log('ver clicked', this.cart);
    this.verItens = true;
  }

  enviarItensPresent() {

    const prompt = this.alertCtrl.create({
      title: 'Enviar Pedido',
      message: "Deseja enviar este pedido?",
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            console.log('Saved clicked');
            this.enviarItens()
          }
        }
      ]
    });
    prompt.present();

  }

  enviarItensPresent2() {
    this.comanda_id = this.codComanda == 0 ? this.comanda : this.codComanda
    console.log(this.comanda_id)
    if (this.comanda_id == 0) {
      const alert = this.alertCtrl.create({
        title: 'Informe a comanda!',
        subTitle: '',
        buttons: ['OK']
      });
      alert.present();
    } else {
      const prompt = this.alertCtrl.create({
        title: 'Enviar Pedido',
        message: "Deseja enviar este pedido?",
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Enviar',
            handler: data => {
              console.log('Saved clicked');
              this.enviarItens()
            }
          }
        ]
      });
      prompt.present();
    }
  }

  selecionaCategoria(categoria) {
    console.log(categoria)
    this.categoriaSelecionada = categoria.id
    this.produtos = categoria.produtos
  }

}
