import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { passwordFormat } from 'src/app/formats/Formats';
import { AuthenticationRequestDto } from 'src/app/models/Authentication/AuthenticationRequestDto';
import { UserRegisterDto } from 'src/app/models/User/UserRegisterDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends SelfUnsubscriberBase implements OnInit {

  isLoginActive!: boolean;

  loginForm: FormGroup; 
  registrationForm: FormGroup;

  firstName: FormControl;
  lastName: FormControl;
  username: FormControl;
  email: FormControl;
  repeatPassword: FormControl;
  passwordRegistration: FormControl;

  userCredentials: FormControl;
  passwordLogin: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: Router,
    private userService: UserService,
  ){
    super();
    this.userCredentials = new FormControl('');
    this.passwordLogin = new FormControl('');

    this.username = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.firstName = new FormControl('', Validators.required);
    this.lastName = new FormControl('', Validators.required);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.passwordRegistration = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(passwordFormat)]);
    this.repeatPassword = new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(passwordFormat)]);


    this.loginForm = this.formBuilder.group({
      'userCredentials': this.userCredentials,
      'password': this.passwordLogin,
    })

    this.registrationForm = this.formBuilder.group ({
      'username' : this.username,
      'firstName': this.firstName,
      'lastName': this.lastName,
      'email': this.email,
      'password': this.passwordRegistration,
      'repeatPassword': this.repeatPassword,
    });
  }

  ngOnInit(): void {
    this.isLoginActive = true;

    if(this.authenticationService.isAuthenticated()){
      this.route.navigate(['home']);
    }
  }

  onRegistration(){
    this.isLoginActive = false;
  }

  onLoginButton(){
    this.isLoginActive = true;
  }

  onSignIn(authentication: AuthenticationRequestDto){

    this.authenticationService.login(authentication)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.route.navigate(['home']);  
    });
  }

  onRegister(registrationDto: UserRegisterDto){
    this.userService.register(registrationDto).
      pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.route.navigate(['login']);
      });
  }


}
