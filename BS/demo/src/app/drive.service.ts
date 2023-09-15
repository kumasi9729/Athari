import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  private readonly API_URL = 'https://www.googleapis.com/upload/drive/v3/files';
  private readonly ACCESS_TOKEN = 'erenthorrocklee'; // This should ideally be fetched securely, not hard-coded

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = {
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
      'Content-Type': 'multipart/related; boundary=foo_bar_baz'
    };

    return this.http.post(this.API_URL, formData, { headers }).toPromise();
  }
}

