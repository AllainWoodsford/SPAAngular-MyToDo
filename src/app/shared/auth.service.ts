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
    private logoutTimer: any;

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
        
        this.http.post<{result:boolean}>(`${endPoint}/auth/register`, authData).subscribe(res => {
            //Returns true if user gets created
            console.log(res);
            if(res.result === true){
                console.log('front end res is true');
                this.router.navigate(['/login']);
            }
        })
    }

    loginUser(username: string, password: string){
        const authData: AuthModel = {username: username, password: password};

        this.http.post<{token: string, expiresIn: number}>(`${endPoint}/auth/login`, authData).subscribe(res => {
            console.log(res);
            this.token = res.token;
            if(this.token){
                //emits value of logged in to all subscribers if token exists
                this.authenticatedSubject.next(true);
                this.isAuthenticated = true;
                this.router.navigate(['/']);
                //Set method to call then pass in time required before triggering it
                this.logoutTimer = setTimeout(() => {
                    this.logout()
                }, res.expiresIn * 1000);
                //multiply by 1000 to convert from seconds to milliseconds
                const now = new Date();
                const expiresDate = new Date(now.getTime() + (res.expiresIn * 1000));
                this.storeLoginDetails(this.token, expiresDate);
            }
        })
    }

    //Log user out, reset the logout timer and push logout to all subscribers
    logout(){
        this.token = '';
        this.isAuthenticated = false;
        //push logged out to all subscribers
        this.authenticatedSubject.next(false);
        //clear timeout for logout timer set to 1hour
        clearTimeout(this.logoutTimer);
        //remove token and expiration timer from local storage
        this.clearLoginDetails();
        this.router.navigate(['/login']);
    }

    //Persist authentication in the browser so token is not destroyed on refresh
    storeLoginDetails(token: string, expirationDate: Date){
        localStorage.setItem('token', token);
        //ISOString serialized version of date
        localStorage.setItem('expiresIn', expirationDate.toISOString());
    }

    //Called on Logout, clears token and expiration date from local storage
    clearLoginDetails(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
    }

    //will be called by authenticateFromLocalStorage to get an existing token in local storage
    getLocalStorageData(){
       const token = localStorage.getItem('token');
       const expiresIn = localStorage.getItem('expiresIn');

       if(!token || !expiresIn){
        return;
       }
       return{
        'token': token,
        'expiresIn': new Date(expiresIn)
       };
    }

    //Checks for a valid token and if its expired or not in order to login from the app.component.ts on ngOnInit
    //If the token is expired clears it from storage
    authenticateFromLocalStorage(){
        const localStorageData = this.getLocalStorageData();
        if(localStorageData)
        {
            const now = new Date();
            const expiresIn = localStorageData.expiresIn.getTime() - now.getTime();
            if(expiresIn > 0){
                this.token = localStorageData.token;
                this.isAuthenticated = true;
                this.authenticatedSubject.next(true);
                //Divide by 1000 to convert from milliseconds to seconds
                //Consider refreshing session to 1hr
                this.logoutTimer.setTimeout(expiresIn / 1000);
            }
            else{
                //Invalid token or has expired
                this.clearLoginDetails();
            }
        }
    }
}