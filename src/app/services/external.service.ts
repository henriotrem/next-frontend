import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import {Api} from '../models/Api.model';
import {Source} from '../models/Source.model';

@Injectable({
  providedIn: 'root'
})
export class ExternalService {

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {}

  getExternalData(source: Source, params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/external/' + source.provider + '/data'
      + this.constantsService.formatQuery(params));
  }

  getExternalContext(source: Source, params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/external/' + source.provider + '/context'
      + this.constantsService.formatQuery(params));
  }
}
