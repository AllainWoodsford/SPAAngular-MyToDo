import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from './auth.model';
import { Subject } from 'rxjs';
import { endPoint } from './api.model';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class AuthService{


    //Subject sets to true when user logs in for other components to subscribe to
    private authenticatedSubject = new Subject<boolean>();
    //Subject for logged in users Id as a string to query the db
    private userSubject = new Subject<string>();
    //Decided by token and grabbing values from local storage
    private isAuthenticated = false;
    private logoutTimer: any;
    private loggedInUserName = '';
    private token: string;

    constructor(private http: HttpClient, private router:Router){}


    getLoggedInUser(){
        if(this.isAuthenticated && this.loggedInUserName !=''){
            return this.loggedInUserName;
        }
        return '';
    }
    getIsAuthenticated(){
        return this.isAuthenticated;
    }

    getAuthenticatedSub(){
        return this.authenticatedSubject.asObservable();
    }

    getUserSub(){
        return this.userSubject.asObservable();
    }

    getToken(){
        return this.token;
    }

    registerUser(username: string, password: string){

        const authData: AuthModel = {username: username, password: password};

        this.http.post<{result:boolean}>(`${endPoint}/auth/register`, authData).subscribe(res => {
            //Returns true if user gets created
            if(res.result === true){
                console.log('front end res is true');
                this.router.navigate(['/login']);
            }
        })
    }

    loginUser(username: string, password: string){
        const authData: AuthModel = {username: username, password: password};

        this.http.post<{token: string, expiresIn: number, userid: string}>(`${endPoint}/auth/login`, authData).subscribe(res => {
            this.token = res.token;
            if(this.token){
                //emits value of logged in to all subscribers if token exists
                this.authenticatedSubject.next(true);
                this.userSubject.next(res.userid);

                this.isAuthenticated = true;
                this.loggedInUserName = res.userid;
                //Set method to call then pass in time required before triggering it
                this.logoutTimer = setTimeout(() => {
                    this.logout()
                }, res.expiresIn * 1000);
                //multiply by 1000 to convert from seconds to milliseconds
                const now = new Date();
                const expiresDate = new Date(now.getTime() + (res.expiresIn * 1000));
                this.storeLoginDetails(this.token, expiresDate, this.loggedInUserName);
                this.router.navigate(['/']);
            }
        })
    }

    //Log user out, reset the logout timer and push logout to all subscribers
    logout(){
        this.token = '';
        this.isAuthenticated = false;
        this.loggedInUserName = '';
        //push logged out to all subscribers
        this.authenticatedSubject.next(false);
        this.userSubject.next('');
        //clear timeout for logout timer set to 1hour
        clearTimeout(this.logoutTimer);
        //remove token and expiration timer from local storage
        this.clearLoginDetails();
        this.router.navigate(['/login']);
    }

    //Persist authentication in the browser so token is not destroyed on refresh
    storeLoginDetails(token: string, expirationDate: Date, userid: string){
        localStorage.setItem('token', token);
        //ISOString serialized version of date
        localStorage.setItem('expiresIn', expirationDate.toISOString());
        localStorage.setItem('userid', userid);
    }

    //Called on Logout, clears token and expiration date from local storage
    clearLoginDetails(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('userid');
    }

    //will be called by authenticateFromLocalStorage to get an existing token in local storage
    getLocalStorageData(){
       const token = localStorage.getItem('token');
       const expiresIn = localStorage.getItem('expiresIn');
       const userid = localStorage.getItem('userid');
        console.log('from local storage: '+ userid);
       if(!token || !expiresIn || !userid){
        return;
       }
       return{
        'token': token,
        'expiresIn': new Date(expiresIn),
        'userid': userid
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
                this.loggedInUserName = localStorageData.userid;
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
