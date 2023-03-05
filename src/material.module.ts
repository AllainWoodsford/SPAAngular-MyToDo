import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  imports: [
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule
  ],
  exports: [
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule
  ]
})
export class MaterialModule {}