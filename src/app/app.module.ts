import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxListSearchModule } from 'projects/ngx-list-search/src/lib/ngx-list-search.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxListSearchModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
