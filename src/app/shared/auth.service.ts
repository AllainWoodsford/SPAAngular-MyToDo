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
    private adminSubject = new Subject<string>();
    //Subject for logged in users Id as a string to query the db
    private userSubject = new Subject<string>();
    //Decided by token and grabbing values from local storage
    private isAuthenticated = false;
    private adminStatus = ''; //has to be string for local storage
    private logoutTimer: any; //token expiry calculation
    private loggedInUserName = ''; //has to be string but its the userId
    private token: string; //JWT


    constructor(private http: HttpClient, private router:Router){}

    //Used to get to the protected route of the admin components
    getIsAdmin(){
      return this.adminStatus;
    }
    //the user ID this is from local storage and the DB intitially
    getLoggedInUser(){
        if(this.isAuthenticated && this.loggedInUserName !=''){
            return this.loggedInUserName;
        }
        return '';
    }

    //Find out if the user has logged in and has the Token
    //Stored in local storage as well as JWT token string
    getIsAuthenticated(){
        return this.isAuthenticated;
    }

    //Subject for the Logged in / auth bool
    getAuthenticatedSub(){
        return this.authenticatedSubject.asObservable();
    }
    //Subject for the isAdmin flag with value of 0 not admin 1 admin
    //from the DB, default is 0
    getAdminSub(){
      return this.adminSubject.asObservable();
    }

    //This is the Subject for the userId
    getUserSub(){
        return this.userSubject.asObservable();
    }

    //The token stored in local storage after log in
    //As well as the Backend API JWT handshake
    getToken(){
        return this.token;
    }

    //Makes a post request and redirects to login
    //We've got a 7 character password min
    //No spaces in username will be removed
    //does not have to be an email
    registerUser(username: string, password: string){

      //Just these username and password at the moment, no email, no cookies etc.
        const authData: AuthModel = {username: username, password: password};

        this.http.post<{result:boolean}>(`${endPoint}/auth/register`, authData).subscribe(res => {
            //Returns true if user gets created
            if(res.result === true){
                this.router.navigate(['/login']);
            }
        })
    }

    //Checks if user exists, then logs them in comparing hashed password entry
    //Need to add lockout for too many fails might be beyond scope though
    //Sets up sub, local storage values and bools that services rely on to get to the protected routes
    loginUser(username: string, password: string){
        const authData: AuthModel = {username: username, password: password};

        this.http.post<{token: string, expiresIn: number, userid: string, adminFlag: number}>(`${endPoint}/auth/login`, authData).subscribe(res => {
            this.token = res.token;
            if(this.token){
                //emits value of logged in to all subscribers if token exists
                this.loggedInUserName = res.userid;
                this.isAuthenticated = true;
                this.adminStatus = res.adminFlag.toString();

                //Subject pushes
                this.userSubject.next(this.loggedInUserName);
                this.authenticatedSubject.next(true);
                this.adminSubject.next(this.adminStatus);

                //Set method to call then pass in time required before triggering it
                this.logoutTimer = setTimeout(() => {
                    this.logout()
                }, res.expiresIn * 1000);
                //multiply by 1000 to convert from seconds to milliseconds
                const now = new Date();
                const expiresDate = new Date(now.getTime() + (res.expiresIn * 1000));

                ///Store local storage for automatic authentication
                this.storeLoginDetails(this.token, expiresDate, this.loggedInUserName, this.adminStatus);

                //Go to todolist screen
                this.router.navigate(['/']);
            }
        })
    }

    //Log user out, reset the logout timer and push logout to all subscribers
    logout(){
        this.token = '';
        this.isAuthenticated = false;
        this.loggedInUserName = '';
        this.adminStatus ='';
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
    storeLoginDetails(token: string, expirationDate: Date, userid: string, adminFlag: string){
        localStorage.setItem('token', token);
        //ISOString serialized version of date
        localStorage.setItem('expiresIn', expirationDate.toISOString());
        localStorage.setItem('userid', userid);
        localStorage.setItem('adminFlag',adminFlag );
    }

    //Called on Logout, clears token and expiration date from local storage
    clearLoginDetails(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('userid');
        localStorage.removeItem('adminFlag');
    }

    //will be called by authenticateFromLocalStorage to get an existing token in local storage
    getLocalStorageData(){
       const token = localStorage.getItem('token');
       const expiresIn = localStorage.getItem('expiresIn');
       const userid = localStorage.getItem('userid');
       const admin = localStorage.getItem('adminFlag');
       if(!token || !expiresIn || !userid){
        return;
       }
       return{
        'token': token,
        'expiresIn': new Date(expiresIn),
        'userid': userid,
        'adminFlag':admin
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
                this.adminStatus = localStorageData.adminFlag!;
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
