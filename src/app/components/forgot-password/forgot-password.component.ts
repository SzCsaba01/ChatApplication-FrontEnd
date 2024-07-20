import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { SendForgotPasswordEmailDto } from 'src/app/models/User/SendForgotPasswordEmailDto';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends SelfUnsubscriberBase implements OnInit {

  email: FormControl;

  forgotPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private userService: UserService,
  ) {
    super();

    this.email = new FormControl('', [Validators.required, Validators.email]);
    

    this.forgotPasswordForm = this.formBuilder.group ({
      'email': this.email,
    });
   }

  ngOnInit(): void {
  }

  sendForgotPasswordEmail(sendForgotPasswordEmailDto: SendForgotPasswordEmailDto){
    this.userService.sendForgotPasswordEmail(sendForgotPasswordEmailDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.route.navigate(['login']);
      })
  }
}
