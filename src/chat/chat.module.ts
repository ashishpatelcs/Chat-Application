import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'chat', component: ChatComponent
      }
    ])
  ],
  declarations: [ChatComponent]
})
export class ChatModule { }
