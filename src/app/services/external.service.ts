import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class ExternalService {


  constructor(private constantsService: ConstantsService, private http: HttpClient) {}

  loadGooglePhotos(): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.constantsService.baseAppUrl + '/api/external/google/photos').subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
