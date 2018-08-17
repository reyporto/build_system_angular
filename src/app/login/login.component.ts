import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validator, EmailValidator, Validators } from '@angular/forms';

declare const firebase, localStorage;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signIn: boolean = true;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    let uid = localStorage.getItem('uid');

    if (uid !== null) {
      this.router.navigate(['catalog']);
    } else {
      this.loginForm = this.formBuilder.group({
        email: [null, Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
          Validators.minLength(5), 
          Validators.maxLength(50)
        ])],
        password: [null, Validators.compose([
          Validators.required,
          Validators.minLength(5), 
          Validators.maxLength(50)
        ])]
      });
    }
  }

  onLogin(form: FormGroup) {
    if (form.valid) {
      this.login(form.value.email, form.value.password).then((uid) => {
        this.signIn = true;
        localStorage.setItem('uid', uid);
        localStorage.setItem('cart', JSON.stringify([]));
        this.router.navigate(['catalog']);
      }).catch(() => {
        this.signIn = false;
      });
    }
  }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(function(data) {
        resolve(data.user.uid);
      })
      .catch(function(error) {
        reject();
      });
    });
  }

}
