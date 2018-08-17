import { Injectable } from '@angular/core';

declare const firebase;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  firestore: any;

  constructor() {
    this.firestore = firebase.firestore();
    this.firestore.settings({ 
      timestampsInSnapshots: true
    });
  }

  getProducts() {
    return new Promise((resolve, reject) => {
      this.firestore.collection('products').get().then((querySnapshot) => {
        let products = [];

        if (!querySnapshot.empty) {
          for (let doc of querySnapshot.docs) {
            products.push(doc.data());
          }
        }

        resolve(products);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  updateStock(products: any) {
    return new Promise((resolve, reject) => {
      this.firestore.collection('products').get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
          for (let product of products) {
            for (let doc of querySnapshot.docs) {
              if (doc.id === product.id) {
                this.firestore.collection('products').doc(doc.id).update({
                  stock: product.stock
                });

                break;
              }
            }
          }

          resolve(true);
        } else {
          resolve(false);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
}
