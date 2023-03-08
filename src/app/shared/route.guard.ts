import { ActivatedRouteSnapshot , CanActivate , RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({providedIn:'root'})
export class RouteGuard implements CanActivate{

    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const isAuthenticated = this.authService.getIsAuthenticated();
        if(!isAuthenticated){
            this.router.navigate(['/login']);
        }
        return isAuthenticated;
    }

}