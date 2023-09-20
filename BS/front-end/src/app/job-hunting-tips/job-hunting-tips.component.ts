import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-job-hunting-tips',
  templateUrl: './job-hunting-tips.component.html',
  styleUrls: ['./job-hunting-tips.component.css']
})
export class JobHuntingTipsComponent {
  fileToUpload: File | null = null;  // Store the file temporarily
  message: string | null = null;  // Optional: to display status messages to the user
  Success: boolean = false;  // The flag for successful upload
  constructor(private http: HttpClient) {}
  onFileSelected(event: any): void {
    console.log("File selection triggered.");
    this.fileToUpload = event.target.files[0];
  }

  onUploadClick(): void {
    if (this.fileToUpload) {
      this.uploadToServer(this.fileToUpload);
    } else {
      this.message = "Please select a file to upload first.";
      this.Success = false;
    }
  }
  private uploadToServer(file: File): void {
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Send the file to your backend, which will handle the upload to Google Drive.
    this.http.post('http://localhost:3000/upload', formData).subscribe(
      response => {
        console.log('Upload to server successful', response);
        this.message = "Upload to server successful.";
        this.Success = true;
      },
     
    );
  }
}
