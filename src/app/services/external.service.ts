import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalService {

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {}

  getGooglePhotos(params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/external/google/photos'
      + this.constantsService.formatQuery(params));
  }

  getSpotifyTrack(params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/external/spotify/track'
      + this.constantsService.formatQuery(params));
  }
}
