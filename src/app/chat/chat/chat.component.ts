import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from '../../socket.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from '../../app.service';
import { ChatMessage } from './chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [SocketService]
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMe', { read: ElementRef })
  public scrollMe: ElementRef;

  private authToken;
  public userInfo;
  public userName;
  private userId;
  public userList = [];
  public disconnectedSocket: boolean;
  public receiverName;
  public receiverId;
  public pageValue;
  public loadingPreviousChat = false;

  public messageText;
  public messageList = [];
  public scrollTop = false;

  // tslint:disable-next-line:max-line-length
  constructor(private socketService: SocketService, private router: Router, private toastr: ToastrService, private appService: AppService) {
    this.userName = Cookie.get('userName');
    this.userId = Cookie.get('userId');
    this.userInfo = this.appService.getUserInfo();
  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.checkStatus();
    this.verifyCurrentUser();
    this.getUserList();
    this.getMessages();
  }

  public checkStatus() {
    if (this.authToken === undefined || this.authToken === '' || this.authToken === null ) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }

  public verifyCurrentUser() {
    this.socketService.verifyUser().subscribe(
      (data) => {
        this.disconnectedSocket = false;
        this.socketService.setUser(this.authToken);
        this.getUserList();
      }
    );
  }

  public getUserList() {
    this.socketService.onlineUserList().subscribe(
      (list) => {
        this.userList = [];
        // tslint:disable-next-line:forin
        for (const user in list) {
          const data = {
            userId: user,
            userName: list[user],
            unread: 0,
            chatting: false
          };
          this.userList.push(data);
        }
        // console.log(this.userList);
      });
  }

  public sendMessageOnKeypress(event) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  public sendMessage() {
    if (this.messageText) {
      const message: ChatMessage = {
        senderName: this.userInfo.firstName + ' ' + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: Cookie.get('receiverName'),
        receiverId: Cookie.get('receiverId'),
        message: this.messageText,
        createdOn: new Date()
      };
      this.socketService.sendChatMessage(message);
      this.pushToChatWindow(message);
    } else {
      this.toastr.warning('Message cannot be empty!');
    }
  }

  public pushToChatWindow(message) {
    this.messageText = '';
    this.messageList.push(message);
    this.scrollTop = false;
  }

  public getMessages() {
    this.socketService.chatByUserId(this.userInfo.userId).subscribe(
      data => {
        if (this.userId === data.receiverId) { this.messageList.push(data); }
        this.toastr.success(`${data.senderName} says ${data.message}`);
        this.scrollTop = false;
      }
    );
  }

  public findNameById(id) {
    for (const user of this.userList) {
      if (user.userId == id) { return user.userName; }
    }
  }

  public receiverChat(id) {
    const name = this.findNameById(id);
    this.userList.map(
      user => {
        if (user.userId === id) {
          user.chatting = true;
        } else {
          user.chatting = false;
        }
      }
    );
    Cookie.set('receiverName', name);
    Cookie.set('receiverId', id);

    this.receiverName = name;
    this.receiverId = id;
    this.pageValue = 0;
    this.messageList = [];
    const chatDetails = {
      receiverId: id,
      senderId: this.userInfo.userId
    };
    this.socketService.markChatAsSeen(chatDetails);
    this.getPreviousChatWithUser();
  }

  public getPreviousChatWithUser() {
    const previousData = this.messageList.length > 0 ? this.messageList.slice() : [];
    this.socketService.getChat(this.userInfo.userId, this.receiverId, this.pageValue * 10).subscribe(
      (response) => {
        if (response['status'] == 200) {
          console.log(response['data'])
          this.messageList = response['data'].concat(previousData);
        } else {
          this.messageList = previousData;
          this.toastr.warning('No new messages available!');
        }
      }
    );
  }

  public paginateChat() {
    this.loadingPreviousChat = false;
    this.pageValue++;
    this.scrollTop = true;
    this.getPreviousChatWithUser();
  }

  public logout() {
    this.appService.logout().subscribe(
      response => {
        if (response['status'] == 200) {
          Cookie.delete('authToken');
          Cookie.delete('userId');
          Cookie.delete('userName');
          this.socketService.exitSocket();
          console.log('logout success');
          this.router.navigate(['/']);
        } else {
          this.toastr.error(response['error']);
        }
      },
      error => {
        this.toastr.error('Some error has occured!');
      }
    );
  }

  public showNotify(name) {
    this.toastr.success(`You are chatting with ${name}`);
  }
}
