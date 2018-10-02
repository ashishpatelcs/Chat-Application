import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from '../user/login/login.component';
import { componentFactoryName } from '@angular/compiler';
import { UserModule } from '../user/user.module';
import { ChatModule } from '../chat/chat.module';
import { ChatComponent } from './chat/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    ChatModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
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
