import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

declare const localStorage;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  products: any = [];
  total: any = 0;
  empty: boolean = true;
  errorMessage: boolean = false;
  disabled: boolean = false;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    let cart = localStorage.getItem('cart');

    if (cart !== null) {
      this.products = JSON.parse(cart);

      for (let product of this.products) {
        this.total += (product.price * product.quantity);
      }
    }

    this.empty = this.total === 0;
  }

  cancel() {
    this.router.navigate(['catalog']);
  }

  pay() {
    if (!this.empty) {
      this.disabled = true;

      this.apiService.updateStock(this.products).then((update) => {
        if (update) {
          localStorage.removeItem('products');
          localStorage.setItem('cart', JSON.stringify([]));

          setTimeout(() => {
            this.disabled = false;
            this.router.navigate(['catalog']);
          }, 1500);
        } else {
          this.disabled = false;
          this.errorMessage = true;
        }
      }).catch((error) => {
        this.disabled = false;
        this.errorMessage = true;
        console.log(error);
      });
    }
  }
  
}
