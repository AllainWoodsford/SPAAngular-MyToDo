import { ActivatedRouteSnapshot , CanActivate , RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({providedIn:'root'})
export class AdminGuard implements CanActivate{

    constructor(private authService: AuthService, private router: Router){}

    //We protect the home route and re-route to login if there is no token
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      const isAuthenticated = this.authService.getIsAuthenticated();
      const isAdmin = this.authService.getIsAdmin();
      if(isAuthenticated && isAdmin === '1'){
        return isAuthenticated;
      }

      if(isAuthenticated){
        this.router.navigate(['/']);
      }
      else{
        this.router.navigate(['/login']);
      }


      return false;

    }

}
