import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthModel } from "./auth.model";
import { endPoint } from "./api.model";
@Injectable({providedIn:"root"})
export class AuthService{

    private token: string;



    constructor(private http: HttpClient){}
    
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
        })
    }
}