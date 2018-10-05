import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class ChatRouteGuardService {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log('Router guard service is running...');
    const atok = Cookie.get('authToke');
    if (atok === undefined || atok === '' || atok === null) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}
