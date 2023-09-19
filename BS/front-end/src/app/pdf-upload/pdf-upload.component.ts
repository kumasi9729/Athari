import { Component } from '@angular/core';

@Component({
  selector: 'app-pdf-upload',
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.css']
})




export class PdfUploadComponent 
{


  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('File selected:', file.name);
      // Do further processing like uploading to a server
    }
  }
}