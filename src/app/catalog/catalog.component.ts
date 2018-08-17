import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

declare const localStorage, document;

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  products: any = [];
  quantity: any = 0;
  empty: boolean = true;
  term: any;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    let productsStorage = localStorage.getItem('products');
    
    if (productsStorage !== null) {
      this.products = JSON.parse(productsStorage);
      this.empty = false;
    } else {
      this.apiService.getProducts().then((data) => {
        localStorage.setItem('products', JSON.stringify(data));
        this.products = data;
        this.empty = false;
      }).catch((error) => {
        console.log('Error', error);
      });
    }
  }

  productDetail(id: any) {
    this.router.navigate(['product', id]);
  }

  addToCart(product: any) {
    let cart = localStorage.getItem('cart');
    let cartTemp = [];
    let quantity = parseInt(document.getElementsByClassName('prodId' + product.id)[0].value);

    if (cart !== null) {
      cartTemp = JSON.parse(cart);

      if (cartTemp.length > 0) {
        let change = false;

        for (let item of cartTemp) {
          if (item.id === product.id) {
            item.quantity = item.quantity + quantity;
            item.stock = item.stock - quantity;
            change = true;
            break;
          }
        }

        if (!change) {
          this.setItemCart(product, cartTemp, quantity);
        } else {
          localStorage.setItem('cart', JSON.stringify(cartTemp));
        }
      } else {
        this.setItemCart(product, cartTemp, quantity);
      }
    } else {
      this.setItemCart(product, cartTemp, quantity);
    }

    this.updateProducts();
    this.updateQuantity();
  }

  updateProducts() {
    let cartStorage = localStorage.getItem('cart');
    let productsStorage = localStorage.getItem('products');

    if (cartStorage !== null && productsStorage !== null) {
      let cartTemp = JSON.parse(cartStorage);
      let productsTemp = JSON.parse(productsStorage);

      if (cartTemp.length > 0) {
        let change = false;

        for (let item of cartTemp) {
          for (let prod of productsTemp) {
            if (prod.id === item.id) {
              prod.stock = item.stock;
              change = true;
              break;
            }
          }
        }

        if (change) {
          localStorage.setItem('products', JSON.stringify(productsTemp));
          this.products = productsTemp;
        }
      }
    }
  }

  setItemCart(product: any, cartTemp: any, quantity: any) {
    let prodTemp = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock - quantity,
      quantity: quantity
    }

    cartTemp.push(prodTemp);
    localStorage.setItem('cart', JSON.stringify(cartTemp));
  }

  updateQuantity() {
    let cartStorage = localStorage.getItem('cart');

    if (cartStorage !== null) {
      let cart = JSON.parse(cartStorage);
      this.quantity = cart.length;
    }
  }

}
