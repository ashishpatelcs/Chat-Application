import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'signup', component: SignupComponent
      }
    ]),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [LoginComponent, SignupComponent]
})
export class UserModule { }
