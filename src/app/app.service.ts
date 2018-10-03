import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private APIURL = 'https://chatapi.edwisor.com';

  constructor(private http: HttpClient) { }

  public signUp(data): Observable<any> {
    const params = new HttpParams().set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('apiKey', data.apiKey);

      return this.http.post(`${this.APIURL}/api/v1/users/signup`, params);
  }

  public signIn(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.APIURL}/api/v1/users/login`, params);
  }

  private handleErrors(err: HttpErrorResponse): Observable<any> {
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `An error occured: ${err.error.message}.`;
    }
    console.log(err.message);
    return Observable.throw(err.message);
  }

  public setUserInfo(data) {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  public getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public logout() {
    const params = new HttpParams()
      .set('userId', Cookie.get('userId'))
      .set('authToken', Cookie.get('authToken'));
    return this.http.post(`${this.APIURL}/api/v1/users/logout`, params);
  }
}
