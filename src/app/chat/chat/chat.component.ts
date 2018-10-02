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

  // tslint:disable-next-line:max-line-length
  constructor(private socketService: SocketService, private router: Router, private toastr: ToastrService, private appService: AppService) {
    this.userName = Cookie.get('userName');
    this.userId = Cookie.get('userId');
    this.userInfo = this.appService.getUserInfo();
    console.log(this.userInfo);
  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.checkStatus();
    this.verifyCurrentUser();
    this.getUserList();
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
}
