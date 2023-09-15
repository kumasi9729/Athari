import { NgModule, enableProdMode } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacialInequityComponent } from './racial-inequity/racial-inequity.component';
import { JobHuntingTipsComponent } from './job-hunting-tips/job-hunting-tips.component';
import { AppComponent } from './app.component';
import { disableDebugTools } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },  { path: 'racial-inequity', component: RacialInequityComponent },
  { path: 'professional-instructions', component: JobHuntingTipsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




