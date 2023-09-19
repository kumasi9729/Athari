import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PdfUploadComponent } from './pdf-upload/pdf-upload.component';
import { RacialInequityComponent } from './racial-inequity/racial-inequity.component';
import { JobHuntingTipsComponent } from './job-hunting-tips/job-hunting-tips.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    PdfUploadComponent,
    RacialInequityComponent,
    JobHuntingTipsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

