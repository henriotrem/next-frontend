import { Injectable } from '@angular/core';
import {File} from '../models/File.model';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from "./constants.service";
import * as crypto from 'crypto-js';
import {AuthService} from "./auth.service";
import {PositionsService} from "./positions.service";

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
