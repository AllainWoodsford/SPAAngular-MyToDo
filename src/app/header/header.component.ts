import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authenticationSub: Subscription;
  private adminSub: Subscription;
  userAuthenticated = false;
  adminStatus = '';
  constructor(private authService: AuthService){ }

  ngOnInit(): void{
    //Not just relying on subscription to tell us if we are logged in or not, because the header might not have loaded before
    //The app pushed out the subscription
    this.userAuthenticated = this.authService.getIsAuthenticated();
    this.adminStatus = this.authService.getIsAdmin();
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.userAuthenticated = status;
    })
    this.adminSub = this.authService.getAdminSub().subscribe(status => {
      this.adminStatus = status;
    });
  }

  ngOnDestroy(): void{
    this.authenticationSub.unsubscribe();
    this.adminSub.unsubscribe();
  }

  logout(){
    this.authService.logout();
  }

  getIsAdmin(){
    if(this.adminStatus === '1'){
      return true;
    }
    return false;
  }
}
