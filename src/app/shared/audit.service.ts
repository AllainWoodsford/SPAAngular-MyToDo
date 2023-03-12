import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { endPoint } from './api.model';
import { Router } from '@angular/router';
import {Audit} from './audit.model';

@Injectable({providedIn:'root'})
export class AuditService{
  constructor(
    private http: HttpClient,
     private router:Router,
      private authService:AuthService,
      ){}


      //Observable make things more better
      public auditsSub = new Subject<Audit[]>();
      private audits : Audit[] = [];
      public isInit = false;
      //Called from the add task button in the todoform compoent
    //is a protected operation
    getAuditData(){
      if(this.authService.getIsAuthenticated() === true && this.authService.getIsAdmin() === '1'){
              this.http.get<{auditList: Audit[]}>(`${endPoint}/administrator/audit/` + this.authService.getLoggedInUser()).subscribe((jsonData) => {
                  this.audits = jsonData.auditList;
                  this.auditsSub.next(this.audits);
                  if(!this.isInit){
                    this.isInit = true;
                  }
          });
      } else {
        this.isInit = false;
      }
    }

    getAuditsSub(){
      return this.auditsSub;
    }

    createAuditEntry(ref: number,username : string,entry : string){

      const auditData = {
        actionRefId: ref,
        action:entry,
        username: username
      };

      this.http.post<{message: string}>(`${endPoint}/administrator/audit`,auditData).subscribe((jsonData) => {
        //post request for audit log
      });
    }

}
