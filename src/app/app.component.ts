import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mytodo';

  constructor(private authService: AuthService){}
  ngOnInit(): void {
    //Checks for token if user has logged in or not and if its valid, if not valid clears it
    this.authService.authenticateFromLocalStorage();
  }
}
