import { Injectable } from '@angular/core';
import {Source} from '../models/Source.model';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from './constants.service';
import * as crypto from 'crypto-js';
import {Api} from '../models/Api.model';
import {ItemsService} from './items.service';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  itemsService: ItemsService;

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {}

  addApis(source: Source, apis: Api[]): any {
    return this.http.post(this.constantsService.baseAppUrl + '/api/sources/' + source._id + '/apis', {apis});
  }

  getApis(source: Source, params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/sources/' + source._id + '/apis'
      + this.constantsService.formatQuery(params));
  }
}
