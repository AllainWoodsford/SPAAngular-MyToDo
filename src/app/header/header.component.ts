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
  userAuthenticated = false;
  constructor(private authService: AuthService){ }

  ngOnInit(): void{
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.userAuthenticated = status;
    })
  }

  ngOnDestroy(): void{
    this.authenticationSub.unsubscribe();
  }
}
