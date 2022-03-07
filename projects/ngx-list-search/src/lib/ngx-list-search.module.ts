import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxListSearchComponent } from './ngx-list-search.component';
@NgModule({
  declarations: [
    NgxListSearchComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  exports: [
    NgxListSearchComponent
  ]
})
export class NgxListSearchModule { }
