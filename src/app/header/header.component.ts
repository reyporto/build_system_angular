import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

declare const firebase, localStorage;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input('quantity') quantity: any = 0;

  constructor(private router: Router) { }

  ngOnInit() {
    let cartStorage = localStorage.getItem('cart');
    
    if (cartStorage !== null) {
      let cart = JSON.parse(cartStorage);
      this.quantity = cart.length;
    }
  }

  goTo(page: string) {
    this.router.navigate(['' + page + '']);
  }

  signOut() {
    this.firebaseSignOut().then(() => {
      localStorage.removeItem('uid');
      localStorage.removeItem('products');
      localStorage.removeItem('cart');
      this.router.navigate(['']);
    }).catch((error) => {
      console.log('Error', error);
    });
  }

  firebaseSignOut() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut().then(function() {
        resolve();
      }).catch(function(error) {
        reject(error);
      });
    });
  }

}
