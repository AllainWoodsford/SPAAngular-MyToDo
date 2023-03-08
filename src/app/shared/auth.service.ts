import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from './auth.model';
import { Subject } from 'rxjs';
import { endPoint } from './api.model';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class AuthService{

    private token: string;
    //Subject sets to true when user logs in for other components to subscribe to
    private authenticatedSubject = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private http: HttpClient, private router:Router){}
    
    getIsAuthenticated(){
        return this.isAuthenticated;
    }

    getAuthenticatedSub(){
        return this.authenticatedSubject.asObservable();
    }

    getToken(){
        return this.token;
    }

    registerUser(username: string, password: string){

        const authData: AuthModel = {username: username, password: password};
        
        this.http.post(`${endPoint}/register/`, authData).subscribe(res => {
            console.log(res);
        })
    }

    loginUser(username: string, password: string){
        const authData: AuthModel = {username: username, password: password};

        this.http.post<{token: string}>(`${endPoint}/login`, authData).subscribe(res => {
            console.log(res);
            this.token = res.token;
            if(this.token){
                //emits value of logged in to all subscribers if token exists
                this.authenticatedSubject.next(true);
                this.isAuthenticated = true;
                this.router.navigate(['/']);
            }
        })
    }
}