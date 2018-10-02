import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class SocketService {

  private APIURL = 'https://chatapi.edwisor.com';
  private socket;
  private authToken;


  constructor(private http: HttpClient) {
    this.socket = io(this.APIURL);
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
