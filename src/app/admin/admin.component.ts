import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Audit } from '../shared/audit.model';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { endPoint } from '../shared/api.model';
import { AuditService } from '../shared/audit.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  myList: Audit[] = []; //list of audit actions from user data
  constructor(
    private router: Router,
     private authService: AuthService,
     private auditService: AuditService,
      ){}

  private authenticationSub = new Subscription();
  private adminSub = new Subscription();
  private userSub = new Subscription();
  private auditsSub = new Subscription();
  isAuthenticated = false;
  isInit = false;
  adminStatus = '';
  loggedInUser = '';


  ngOnInit(): void{
    //Get authentication
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.adminStatus = this.authService.getIsAdmin();
    this.loggedInUser = this.authService.getLoggedInUser();

    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.isAuthenticated = status;
    });
    this.adminSub = this.authService.getAdminSub().subscribe(status => {
      this.adminStatus = status;
    });
    this.userSub = this.authService.getUserSub().subscribe(status => {
      this.loggedInUser = status;
    })
    this.auditsSub = this.auditService.getAuditsSub().subscribe( audits => {
      this.myList = audits;
      this.isInit = true; //change to sub / observable later
    })

    //Grab audit if authenticated otherwise navigate back to login
    if(!this.isAuthenticated && this.adminStatus != '1'){
      this.authService.logout();
      this.isInit = false;
      this.router.navigate(['/login']);
    } else {
      //Grab the Audit backend data

      this.auditService.getAuditData();
    }

  }

  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
    this.adminSub.unsubscribe();
    this.userSub.unsubscribe();
    this.auditsSub.unsubscribe();
  }


}
