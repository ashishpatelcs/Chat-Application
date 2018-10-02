import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email: string;
  public password: string;

  constructor(private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.toastr.info('Please Login to access chat');
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  signIn() {
    return 0;
  }

}
