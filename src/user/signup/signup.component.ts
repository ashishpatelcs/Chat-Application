import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName: string;
  public lastName: string;
  public mobile: number;
  public email: string;
  public password: string;
  public apiKey: string;

  constructor(private appService: AppService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  signUp() {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      mobileNumber: this.mobile,
      email: this.email,
      password: this.password,
      apiKey: this.apiKey
    };

    if (!this.firstName) {
      this.toastr.warning('enter first name');
    } else if (!this.lastName) {
      this.toastr.warning('enter last name');
    } else if (!this.mobile) {
      this.toastr.warning('enter mobile');
    } else if (!this.email) {
      this.toastr.warning('enter email');
    } else if (!this.password) {
      this.toastr.warning('enter password');
    } else if (!this.apiKey) {
      this.toastr.warning('Enter your API key');
    } else {
      this.appService.signUp(data).subscribe(
        response => {
          if (response.status === 200) {
            this.toastr.success('Signup Successful!');
            this.router.navigate(['/login']);
          } else {
            this.toastr.error(response.message);
          }
        },
        err => {
          console.log(err.errMessage);
        }
      );
    }
  }

}
