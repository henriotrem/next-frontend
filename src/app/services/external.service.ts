import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import {Api} from '../models/Api.model';
import {Source} from '../models/Source.model';
import {map} from 'rxjs/operators';
import {Photo} from '../models/Photo.model';
import {Website} from '../models/Website.model';
import {Watch} from '../models/Watch.model';
import {Music} from '../models/Music.model';

@Injectable({
  providedIn: 'root'
})
export class ExternalService {

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {}

  getExternalData(source: Source, params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/external/' + source.provider + '/data'
      + this.constantsService.formatQuery(params))
      .pipe(
        map((result: any) => {
          if (result.photos.length > 0) {
            for (let i = 0; i < result.photos.length; i++) {
              result.photos[i] = Object.assign(new Photo(), result.photos[i]);
            }
          } else if (result.musics.length > 0) {
            for (let i = 0; i < result.musics.length; i++) {
              result.musics[i] = Object.assign(new Music(), result.musics[i]);
            }
          } else if (result.watches.length > 0) {
            for (let i = 0; i < result.watches.length; i++) {
              result.watches[i] = Object.assign(new Watch(), result.watches[i]);
            }
          } else if (result.websites.length > 0) {
            for (let i = 0; i < result.websites.length; i++) {
              result.websites[i] = Object.assign(new Website(), result.websites[i]);
            }
          }
          return result;
        })
      );
  }

  getExternalContext(source: Source, params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/external/' + source.provider + '/context'
      + this.constantsService.formatQuery(params));
  }
}
