import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ProdutoService {
    API_CONFIG = '';
    constructor(public http: HttpClient) {
        this.API_CONFIG = window.localStorage['api'];
    }

    maisPedidos(){
        return this.http.get(`${this.API_CONFIG}/api/pedidoProduto/maisPedidos`);
    } 

    categorias(){
        return this.http.get(`${this.API_CONFIG}/api/pedidoProduto/categorias`);
    }

    all(){
        return this.http.get(`${this.API_CONFIG}/api/pedidoProduto/all`);
    } 

    adicionais(){
        return this.http.get(`${this.API_CONFIG}/api/pedidoProduto/adicionais`);
    } 

    tamanhosPizza(){
        return this.http.get(`${this.API_CONFIG}/api/pedidoProduto/tamanhosPizza`);
    } 

    saboresPorTamanho(tamanho, saborPrincipal){
        return this.http.get(`${this.API_CONFIG}/api/pedidoProduto/saboresPorTamanho?tamanho=${tamanho}&saborPrincipal=${saborPrincipal}`);
    } 

    pizzaValorPorTamanho(tamanho, produto){
        return this.http.get(`${this.API_CONFIG}/api/pedidoProduto/pizzaValorPorTamanho?tamanho=${tamanho}&produto=${produto}`);
    } 

    pesquisa(pesquisa: string){
        return this.http.get(
            `${this.API_CONFIG}/api/pedidoProduto/pesquisaRest?pesquisa=${pesquisa}`
        )
    }

    dividePizza(){
        return this.http.get(`${this.API_CONFIG}/api/pedidoProduto/dividePizza`);
    }


}