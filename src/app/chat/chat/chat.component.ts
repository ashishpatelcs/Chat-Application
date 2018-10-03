import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../socket.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [SocketService]
})
export class ChatComponent implements OnInit {
  private authToken;
  public userInfo;
  public userName;
  private userId;
  public userList = [];
  public disconnectedSocket: boolean;
  public receiverName;
  public receiverId;
  public pageValue;

  public messageText;
  public messageList = [];
  public scrollTop: boolean;

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
      (userList) => {
        this.userList = [];
        for (const user of userList) {
          const data = {
            userId: user,
            userName: userList[user],
            unread: 0,
            chatting: false
          };
          this.userList.push(data);
        }
        console.log(this.userList);
      });
  }

  public sendMessageOnKeypress(event) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  public sendMessage() {
    if (this.messageText) {
      const message = {
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
        if (this.userId === data.senderId) { this.messageList.push(data); }
        this.toastr.success(`${data.senderName} says ${data.message}`);
        this.scrollTop = false;
      }
    );
  }

  public receiverChat(id, name) {
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
      userId: this.userInfo.userId,
      senderId: id
    };
    this.socketService.markChatAsSeen(chatDetails);
    this.getPreviousChatWithUser();
  }

  public getPreviousChatWithUser() {
  }
}
