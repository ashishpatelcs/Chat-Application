import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email: string;
  public password: string;

  constructor(private toastr: ToastrService, private router: Router, private appService: AppService ) { }

  ngOnInit() {
    this.toastr.info('Please Login to access chat');
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  signIn() {
    const data = {
      email: this.email,
      password: this.password
    };
    if (!this.email) {
      this.toastr.warning('Email is required!');
    } else if (!this.password) {
      this.toastr.warning('Password is required!');
    } else {
      this.appService.signIn(data).subscribe(
        Response => {
          if (Response.status === 200) {
            console.log(Response);
            const user = Response.data;
            const userDetails = user.userDetails;
            Cookie.set('authToken', user.authToken);
            Cookie.set('userName', userDetails.firstName + ' ' + userDetails.lastName);
            Cookie.set('userId', userDetails.userId);
            this.appService.setUserInfo(userDetails);
            this.router.navigate(['/chat']);
          } else {
            this.toastr.error(Response.message);
          }
        },
        err => {
          console.log(err.errMessage);
        }
      );
    }
  }

}
