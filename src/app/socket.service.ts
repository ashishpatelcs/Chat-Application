import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class SocketService {

  private APIURL = 'http://localhost:3000/chat';
  private socket;
  private authToken;


  constructor(private http: HttpClient) {
    this.socket = io(this.APIURL);
    this.authToken = Cookie.get('authToken');
  }

  public verifyUser() {
    return Observable.create( (observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      });
    });
  }

  public onlineUserList() {
    return Observable.create( (observer) => {
      this.socket.on('online-user-list', (userList) => {
        console.log(userList);
        observer.next(userList);
      });
    });
  }

  public disconnectUser() {
    return Observable.create( (observer) => {
      this.socket.on('disconnect', () => {
        observer.next();
      });
    });
  }

  public setUser(authToken) {
    this.socket.emit('set-user', authToken);
  }

  public chatByUserId(userId) {
    return Observable.create( observer => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      });
    });
  }

  public getChat(senderId, receiverId, skip) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`http://localhost:3000/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${this.authToken}`);
  }

  public sendChatMessage(message) {
    this.socket.emit('chat-msg', message);
  }

  public exitSocket() {
    this.socket.disconnect();
  }

  public markChatAsSeen(userDetails) {
    this.socket.emit('mark-chat-as-seen', userDetails);
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';

    if (err.error instanceof Error) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }

    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }

}
