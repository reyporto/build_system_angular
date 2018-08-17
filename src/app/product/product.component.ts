import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare const localStorage;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: any = {};
  empty: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      let productsStorage = localStorage.getItem('products');

      if (productsStorage !== null) {
        let products = JSON.parse(productsStorage);
        
        if (products.length > 0) {
          for (let product of products) {
            if (product.id === param.id) {
              this.product = product;
              break;
            }
          }
        }

        this.empty = Object.keys(this.product).length === 0;
      }
    });
  }

  back() {
    this.router.navigate(['catalog']);
  }

}
