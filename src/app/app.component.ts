import { Component } from '@angular/core';
import { Router } from '@angular/router';

declare const localStorage;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router) { }

  ngOnInit() {
    let uid = localStorage.getItem('uid');

    if (uid === null) {
      this.router.navigate(['']);
    }
  }
}
