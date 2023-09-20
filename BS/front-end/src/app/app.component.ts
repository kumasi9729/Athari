import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  fileToUpload: File | null = null;  // Store the file temporarily
  message: string | null = null;  // Optional: to display status messages to the user
  Success: boolean = false;  // The flag for successful upload
isSideNavCollapsed = false;
screenWidth = 0;
  constructor(private http: HttpClient) {}

  onToggleSideNav(data: SideNavToggle): void{
this.screenWidth = data.screenWidth;
this.isSideNavCollapsed = data.collapsed;
  }

}
