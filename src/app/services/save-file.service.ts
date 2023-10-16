import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { SaveDataService } from './save-data.service';
import { FileResponse } from '../models/file-response';

@Injectable({
  providedIn: 'root'
})
export class SaveFileService {

  constructor(
    private httpClient: HttpClient,
    private saveDataService: SaveDataService
  ) { }

  saveFileToApi(file: File): Observable<FileResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<FileResponse>(`${environment.apiUrl}auth/clients/select-patient-care/upload/${this.saveDataService.ihconfigId}`, formData);
  }
}
