import { 
    HttpHandler,
    HttpInterceptor,
    HttpRequest 
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({providedIn:"root"})
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService){}

    intercept(req: HttpRequest<any>, next: HttpHandler){
       const token = this.authService.getToken();
       if(!token){
            console.log('intercept failed no token');
            return next.handle(req);
       }
       //Enrich request with token if it exists
       //Express middleware will recieve it
       const authRequest = req.clone({
        headers: req.headers.set("Authorization", token)
       });
       return next.handle(authRequest);
    }
}