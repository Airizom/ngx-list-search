import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
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
    MatListModule,
    ReactiveFormsModule
  ],
  exports: [
    NgxListSearchComponent
  ]
})
export class NgxListSearchModule { }
