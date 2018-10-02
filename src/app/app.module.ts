import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from '../user/login/login.component';
import { componentFactoryName } from '@angular/compiler';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'login', component: LoginComponent, pathMatch: 'full'
      },
      {
        path: '', component: LoginComponent, pathMatch: 'full'
      },
      {
        path: '*', component: LoginComponent
      },
      {
        path: '**', component: LoginComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
