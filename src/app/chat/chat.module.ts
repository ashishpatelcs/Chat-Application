import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UserDetailsComponent } from '../shared/user-details/user-details.component';
import { FirstCharComponent } from '../shared/first-char/first-char.component';
import { RemoveSpecialCharPipe } from './../shared/pipe/remove-special-char.pipe';
import { FormsModule } from '@angular/forms';
import { ChatRouteGuardService } from './chat-route-guard.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'chat', component: ChatComponent, canActivate: [ChatRouteGuardService]
      }
    ])
  ],
  declarations: [ChatComponent, RemoveSpecialCharPipe],
  providers: [ChatRouteGuardService]
})
export class ChatModule { }
